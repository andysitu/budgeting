using Budgeting.Models.Transactions;
using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class HoldingTransferDto
{
    public long from_holding_id { get; set; }
    public long to_holding_id { get; set; }
    public decimal from_shares { get; set; }
    public decimal to_shares { get; set; }
}

public class AddToHoldingDto
{
    public decimal? shares { get; set; }
    public decimal? amount { get; set; }
    public bool modify { get; set; } = true;
    public string? name { get; set; }
    public string? description { get; set; }
    public DateTime? date { get; set; }
}

public class UpdateHoldingDto
{
    public List<long>? typeIds { get; set; }
    public string? name { get; set; }
    public decimal? shares { get; set; }
    public decimal? price { get; set; }
    // Providing a historical date and time records values without updating the holding.
    public DateTime? historicalDate { get; set; }
}

public class HoldingHistoryDto
{
    public long id { get; set; }
    public decimal old_shares { get; set; }
    public decimal new_shares { get; set; }
    public decimal old_price { get; set; }
    public decimal new_price { get; set; }
    public DateTime date { get; set; }
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
    public bool is_historical { get; set; }
}

[Authorize]
[ApiController]
[Route("holdings")]
public class HoldingsController : Controller
{
    private readonly ApplicationDbContext _context;
    public HoldingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("transfer")]
    public async Task<ActionResult> Transfer([FromBody] HoldingTransferDto holdingTransferDto)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        Holding? fromHolding = await _context.Holdings.Where(h => h.Id == holdingTransferDto.from_holding_id).SingleAsync();
        if (fromHolding == null)
        {
            return NotFound();
        }

        Holding? toHolding = await _context.Holdings.Where(h => h.Id == holdingTransferDto.to_holding_id).SingleAsync();
        if (toHolding == null)
        {
            return NotFound();
        }

        if (holdingTransferDto.from_shares > fromHolding.Shares)
        {
            return BadRequest("Not enough shares to transfer out of the holding");
        }
        else if (holdingTransferDto.to_shares <= 0)
        {
            return BadRequest("Need a positive shares to transfer to the new holding");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            fromHolding.Shares -= holdingTransferDto.from_shares;
            toHolding.Shares += holdingTransferDto.to_shares;

            var sourceHoldingTransaction = new HoldingTransaction
            {
                Shares = holdingTransferDto.from_shares,
                Price = fromHolding.Price,
                HoldingId = fromHolding.Id,
                AppUserId = userId,
            };

            var destHoldingTransaction = new HoldingTransaction
            {
                Shares = holdingTransferDto.to_shares,
                Price = toHolding.Price,
                HoldingId = toHolding.Id,
                AppUserId = userId,
            };

            Transaction t = new()
            {
                Date = DateTime.UtcNow,
                ModifiedHolding = true,
                FromHoldingTransaction = sourceHoldingTransaction,
                ToHoldingTransaction = destHoldingTransaction,
                AppUserId = userId,
            };

            _context.Transactions.Add(t);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("{holdingId}/add")]
    public async Task<ActionResult> AddToHolding(long holdingId, [FromBody] AddToHoldingDto addToHoldingDto)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        Holding? toHolding = await _context.Holdings.Where(h => h.Id == holdingId).SingleAsync();

        if (toHolding == null) return NotFound();

        decimal shares = 1;
        decimal price = toHolding.Price;
        if (addToHoldingDto.amount != null & addToHoldingDto.amount != 0)
        {
            shares = (addToHoldingDto.amount ?? 1) / price;
        }
        else if (addToHoldingDto.shares != null & addToHoldingDto.shares != 0)
        {
            shares = addToHoldingDto.shares ?? 1;
        }
        else
        {
            return BadRequest("Either amount or shares must be provided.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var destHoldingTransaction = new HoldingTransaction
            {
                HoldingId = toHolding.Id,
                AppUserId = userId,
                Shares = shares,
                Price = price
            };

            Transaction t = new()
            {
                Date = DateTime.UtcNow,
                ModifiedHolding = addToHoldingDto.modify,
                ToHoldingTransaction = destHoldingTransaction,
                AppUserId = userId,
                Name = addToHoldingDto.name ?? "",
                Description = addToHoldingDto.description ?? "",
            };

            if (addToHoldingDto.modify)
            {
                toHolding.Shares += shares;
            }

            _context.Transactions.Add(t);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return Ok();
    }

    [Authorize]
    [HttpPatch("{holdingId}")]
    public async Task<ActionResult<HoldingDto>> UpdateHolding(long holdingId, [FromBody] UpdateHoldingDto updateHoldingDto)
    {
        DateTime? historicalDate = updateHoldingDto.historicalDate;

        bool isHistoricalEntry = historicalDate.HasValue;
        if (historicalDate.HasValue && historicalDate.Value.Kind == DateTimeKind.Unspecified)
        {
            return BadRequest("Historical date must include a timezone (for example, 2026-09-28T14:30:00Z).");
        }

        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        bool needHoldingLog = false;

        Holding? holding = await _context.Holdings.Include(h => h.Types).FirstOrDefaultAsync(h => h.Id == holdingId);
        if (holding == null)
        {
            return NotFound();
        }
        if (holding.AppUserId != userId)
        {
            return Unauthorized();
        }

        var holdingLog = new HoldingLog
        {
            OldShares = holding.Shares,
            NewShares = holding.Shares,
            OldPrice = holding.Price,
            NewPrice = holding.Price,
            AppUserId = userId,
            HoldingId = holding.Id,
        };

        bool modifiedHolding = false;
        if (isHistoricalEntry && updateHoldingDto.typeIds != null)
            return BadRequest("Types cannot be changed in a historical entry.");
        if (updateHoldingDto.typeIds != null)
        {
            var ids = updateHoldingDto.typeIds.Distinct().ToList();
            var existingIds = holding.Types.Select(t => t.Id).ToList();
            var types = await _context.HoldingTypes
                .Where(t => t.AppUserId == userId && ids.Contains(t.Id)
                    && (t.Active || existingIds.Contains(t.Id))).ToListAsync();
            if (types.Count != ids.Count)
                return BadRequest("One or more holding types are unavailable.");
            holding.Types = types;
            modifiedHolding = true;
        }
        if (isHistoricalEntry)
        {
            if ((updateHoldingDto.shares == null && updateHoldingDto.price == null)
                || updateHoldingDto.shares < 0 || updateHoldingDto.price < 0)
            {
                return BadRequest("Historical entries require non-negative shares or price.");
            }

            holdingLog.HistoricalDate = historicalDate?.ToUniversalTime();
            holdingLog.NewShares = updateHoldingDto.shares ?? holding.Shares;
            holdingLog.NewPrice = updateHoldingDto.price ?? holding.Price;
            needHoldingLog = true;
        }
        else
        {
            if (!string.IsNullOrEmpty(updateHoldingDto.name))
            {
                holding.Name = updateHoldingDto.name;
                _context.Entry(holding).Property(x => x.Name).IsModified = true;
                modifiedHolding = true;
            }
            if (updateHoldingDto.shares != null && updateHoldingDto.shares >= 0)
            {
                holdingLog.NewShares = (decimal)updateHoldingDto.shares;

                holding.Shares = (decimal)updateHoldingDto.shares;
                _context.Entry(holding).Property(x => x.Shares).IsModified = true;
                modifiedHolding = true;
                needHoldingLog = true;
            }
            if (updateHoldingDto.price != null && updateHoldingDto.price >= 0)
            {
                holdingLog.NewPrice = (decimal)updateHoldingDto.price;

                holding.Price = (decimal)updateHoldingDto.price;
                _context.Entry(holding).Property(x => x.Price).IsModified = true;
                modifiedHolding = true;
                needHoldingLog = true;
            }
        }


        if (!isHistoricalEntry && !modifiedHolding)
        {
            return BadRequest("Holding was unmodified");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            if (needHoldingLog)
            {
                _context.HoldingLog.Add(holdingLog);
            }

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }


        return new HoldingDto
        {
            Id = holding.Id,
            AccountId = holding.AccountId,
            Types = holding.Types.Select(HoldingTypeDto.From).ToList(),
            Name = holding.Name,
            Shares = holding.Shares,
            Price = holding.Price,
            IsMonetary = holding.IsMonetary,
        };
    }

    private List<HoldingTransactionDto> MapHoldingTransactionDto(List<HoldingTransaction> holdingTransactions)
    {
        List<HoldingTransactionDto> dtos = new();

        foreach (HoldingTransaction holdingTransaction in holdingTransactions)
        {
            HoldingTransactionDto holdingTransactionDto = new()
            {
                id = holdingTransaction.Id,
                shares = holdingTransaction.Shares,
                price = holdingTransaction.Price,
            };

            if (holdingTransaction.SourceTransaction != null)
            {
                Transaction t = holdingTransaction.SourceTransaction;
                TransactionBaseDto sourceTransaction = new()
                {
                    id = t.Id,
                    name = t.Name,
                    description = t.Description,
                    modified_holding = t.ModifiedHolding,
                };
                holdingTransactionDto.source_transaction = sourceTransaction;
            }

            if (holdingTransaction.DestinationTransaction != null)
            {
                Transaction t = holdingTransaction.DestinationTransaction;
                TransactionBaseDto destTransaction = new()
                {
                    id = t.Id,
                    name = t.Name,
                    description = t.Description,
                    modified_holding = t.ModifiedHolding,
                };
                holdingTransactionDto.destination_transaction = destTransaction;
            }
            if (holdingTransaction.Holding != null)
            {
                Holding h = holdingTransaction.Holding;
                HoldingDto dto = new()
                {
                    Id = h.Id,
                    AccountId = h.AccountId,
                    Types = h.Types.Select(HoldingTypeDto.From).ToList(),
                    Name = h.Name,
                    Shares = h.Shares,
                    Price = h.Price,
                    IsMonetary = h.IsMonetary,
                };
                holdingTransactionDto.holding = dto;
            }
            dtos.Add(holdingTransactionDto);
        }

        return dtos;
    }

    [Authorize]
    [HttpGet("{holdingId}/transactions")]
    public async Task<List<HoldingTransactionDto>> GetHoldingTransactions(int holdingId)
    {
        var holdingTransactions = await _context.HoldingTransactions
            .Include(ht => ht.SourceTransaction)
            .Include(ht => ht.DestinationTransaction)
            .Include(ht => ht.Holding).ThenInclude(h => h!.Types)
            .Where(ht => ht.HoldingId == holdingId && ht.AppUserId == Util.getCurrentUserId(HttpContext))
            .ToListAsync();
        return MapHoldingTransactionDto(holdingTransactions);
    }

    [Authorize]
    [HttpGet("{holdingId}/history")]
    public async Task<ActionResult<List<HoldingHistoryDto>>> GetHoldingHistory(long holdingId)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        bool holdingExists = await _context.Holdings
            .AnyAsync(h => h.Id == holdingId && h.AppUserId == userId);
        if (!holdingExists)
        {
            return NotFound();
        }

        var history = await _context.HoldingLog
            .Where(log => log.HoldingId == holdingId && log.AppUserId == userId)
            .OrderByDescending(log => log.HistoricalDate ?? log.CreatedAt)
            .Select(log => new HoldingHistoryDto
            {
                id = log.Id,
                old_shares = log.OldShares,
                new_shares = log.NewShares,
                old_price = log.OldPrice,
                new_price = log.NewPrice,
                date = log.HistoricalDate ?? log.CreatedAt,
                created_at = log.CreatedAt,
                updated_at = log.UpdatedAt,
                is_historical = log.HistoricalDate.HasValue,
            })
            .ToListAsync();

        return Ok(history);
    }
}
