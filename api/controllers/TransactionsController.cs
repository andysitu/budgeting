
using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Does not include references to holding transactions
public class TransactionBaseDto
{
    public long id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public decimal amount { get; set; }
    public bool modified_holding { get; set; }
    public DateTime? date { get; set; }
    public DateTime created { get; set; }
    public DateTime updated { get; set; }
    public bool active { get; set; }
}

public class HoldingTransactionBaseDto
{
    public long id { get; set; }
    public decimal shares { get; set; }
    public decimal price { get; set; }
    public HoldingDto? holding { get; set; }
}

public class HoldingTransactionDto : HoldingTransactionBaseDto
{
    public TransactionBaseDto? source_transaction { get; set; }
    public TransactionBaseDto? destination_transaction { get; set; }
}

public class TransactionDto : TransactionBaseDto
{
    public required HoldingTransactionDto to_holding_transaction { get; set; }
    public HoldingTransactionDto? from_holding_transaction { get; set; }
}

[Authorize]
[ApiController]
[Route("transactions")]
public class TransactionsController : Controller
{
    private readonly ApplicationDbContext _context;
    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    public class TransactionQuery
    {
        public int? holdingId { get; set; } = null;
    }

    [Authorize]
    [HttpGet("")]
    public async Task<IActionResult> GetTransactions([FromQuery] TransactionQuery query)
    {
        var transactionQuery = _context.Transactions
            .AsQueryable();

        if (query.holdingId != null)
        {
            transactionQuery = transactionQuery.Where(t => t.ToHoldingTransaction.HoldingId == query.holdingId ||
                (t.FromHoldingTransaction != null && t.FromHoldingTransaction.HoldingId == query.holdingId));
        }
        var transactions = await transactionQuery
            .Select(t => new TransactionDto
            {
                id = t.Id,
                active = t.Active,
                name = t.Name,
                description = t.Description,
                modified_holding = t.ModifiedHolding,
                date = t.Date,
                created = t.CreatedAt,
                updated = t.UpdatedAt,
                to_holding_transaction = new()
                {
                    id = t.ToHoldingTransaction.Id,
                    shares = t.ToHoldingTransaction.Shares,
                    price = t.ToHoldingTransaction.Price,
                    holding = t.ToHoldingTransaction.Holding == null ? null : new HoldingDto
                    {
                        Id = t.ToHoldingTransaction.Holding.Id,
                        Name = t.ToHoldingTransaction.Holding.Name,
                    }
                },
                from_holding_transaction = t.FromHoldingTransaction == null ? null : new()
                {
                    id = t.FromHoldingTransaction.Id,
                    shares = t.FromHoldingTransaction.Shares,
                    price = t.FromHoldingTransaction.Price,
                    holding = t.FromHoldingTransaction.Holding == null ? null : new HoldingDto
                    {
                        Id = t.FromHoldingTransaction.Holding.Id,
                        Name = t.FromHoldingTransaction.Holding.Name,
                    }
                },

            })
            .ToListAsync();
        return Ok(transactions);
    }

    public async Task setTransactionActive(Transaction transaction, bool active)
    {
        // Need to undo holdings
        if (transaction.ModifiedHolding)
        {
            var toHoldingTrans = transaction.ToHoldingTransaction;
            if (toHoldingTrans != null)
            {
                var holding = await _context.Holdings.FirstOrDefaultAsync(
                    h => h.Id == toHoldingTrans.HoldingId);
                if (holding != null)
                {
                    if (active)
                    {
                        holding.Shares -= toHoldingTrans.Shares;
                    }
                    else
                    {
                        holding.Shares += toHoldingTrans.Shares;
                    }
                }
            }

            var fromHoldingTrans = transaction.FromHoldingTransaction;
            if (fromHoldingTrans != null)
            {
                var holding = await _context.Holdings.FirstOrDefaultAsync(
                    h => h.Id == fromHoldingTrans.HoldingId);
                if (holding != null)
                {
                    if (active)
                    {
                        holding.Shares += fromHoldingTrans.Shares;
                    }
                    else
                    {
                        holding.Shares -= fromHoldingTrans.Shares;

                    }

                }
            }
        }
        transaction.Active = active;

        await _context.SaveChangesAsync();
    }

    [Authorize]
    [HttpDelete("{transactionId}")]
    public async Task<ActionResult> SetTransactionInactive(long transactionId)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        Transaction? transaction = await _context.Transactions
            .Include(t => t.ToHoldingTransaction)
            .Include(t => t.FromHoldingTransaction)
            .Where(t => t.Active)
            .FirstOrDefaultAsync(t => t.Id == transactionId);

        if (transaction == null)
        {
            return NotFound();
        }
        if (transaction.AppUserId != userId)
        {
            return Unauthorized();
        }
        if (!transaction.Active)
        {
            return BadRequest("The transaction is already inactive.");
        }

        await setTransactionActive(transaction, false);
        return Ok();
    }

    [Authorize]
    [HttpPost("{transactionId}")]
    public async Task<ActionResult> SetTransactionActive(long transactionId)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        Transaction? transaction = await _context.Transactions
            .Include(t => t.ToHoldingTransaction)
            .Include(t => t.FromHoldingTransaction)
            .Where(t => !t.Active)
            .FirstOrDefaultAsync(t => t.Id == transactionId);

        if (transaction == null)
        {
            return NotFound();
        }
        if (transaction.AppUserId != userId)
        {
            return Unauthorized();
        }
        if (transaction.Active)
        {
            return BadRequest("The transaction is already active.");
        }

        await setTransactionActive(transaction, true);
        return Ok();
    }
}
