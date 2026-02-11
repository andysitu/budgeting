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
    public string? Name;
    public decimal? Shares;
    public decimal? Price;
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
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        Holding? holding = await _context.Holdings.FirstOrDefaultAsync(h => h.Id == holdingId);
        if (holding == null)
        {
            return NotFound();
        }
        if (holding.AppUserId != userId)
        {
            return Unauthorized();
        }
        bool modified = false;
        if (!string.IsNullOrEmpty(updateHoldingDto.Name))
        {
            holding.Name = updateHoldingDto.Name;
            _context.Entry(holding).Property(x => x.Name).IsModified = true;
            modified = true;
        }
        if (updateHoldingDto.Shares != null && updateHoldingDto.Shares >= 0)
        {
            holding.Shares = (decimal)updateHoldingDto.Shares;
            _context.Entry(holding).Property(x => x.Shares).IsModified = true;
            modified = true;
        }
        if (updateHoldingDto.Price != null && updateHoldingDto.Price >= 0)
        {
            holding.Price = (decimal)updateHoldingDto.Price;
            _context.Entry(holding).Property(x => x.Price).IsModified = true;
            modified = true;
        }

        if (modified)
        {
            throw new Exception("Holding was unmodified");
        }
        await _context.SaveChangesAsync();

        return new HoldingDto
        {
            Id = holding.Id,
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
            .Include(ht => ht.Holding)
            .Where(ht => ht.HoldingId == holdingId)
            .ToListAsync();
        return MapHoldingTransactionDto(holdingTransactions);
    }
}