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
    public long from_shares { get; set; }
    public long to_shares { get; set; }
}

public class TransactionDto
{
    public long id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public decimal amount { get; set; }
    public bool modified_holding { get; set; }
}

public class HoldingTransactionDto
{
    public long id { get; set; }
    public decimal shares { get; set; }
    public decimal price { get; set; }
    public TransactionDto? source_transaction { get; set; }
    public TransactionDto? destination_transaction { get; set; }
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
                TransactionDto sourceTransaction = new()
                {
                    id = t.Id,
                    name = t.Name,
                    description = t.Description,
                    amount = t.Amount,
                    modified_holding = t.ModifiedHolding,
                };
                holdingTransactionDto.source_transaction = sourceTransaction;
            }

            if (holdingTransaction.DestinationTransaction != null)
            {
                Transaction t = holdingTransaction.DestinationTransaction;
                TransactionDto destTransaction = new()
                {
                    id = t.Id,
                    name = t.Name,
                    description = t.Description,
                    amount = t.Amount,
                    modified_holding = t.ModifiedHolding,
                };
                holdingTransactionDto.destination_transaction = destTransaction;
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
            .Where(ht => ht.HoldingId == holdingId)
            .ToListAsync();
        return MapHoldingTransactionDto(holdingTransactions);
    }
}