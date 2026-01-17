
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    [HttpGet("/transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] TransactionQuery query)
    {
        var transactionQuery = _context.Transactions
                .Include(t => t.ToHoldingTransaction)
                .Include(t => t.FromHoldingTransaction)
                .AsQueryable();

        if (query.holdingId != null)
        {
            transactionQuery = transactionQuery.Where(t => t.ToHoldingTransactionId == query.holdingId ||
                t.FromHoldingTransactionId == query.holdingId);
        }
        Console.WriteLine(query.holdingId);
        var transactions = await transactionQuery
            .Select (t =>  new TransactionDto
            {
                id = t.Id,
                name = t.Name,
                description = t.Description,
                amount = t.Amount,
                modified_holding = t.ModifiedHolding,
                to_holding_transaction = new()
                {
                    id = t.ToHoldingTransaction.Id,
                    shares = t.ToHoldingTransaction.Shares,
                    price = t.ToHoldingTransaction.Price,
                },
                from_holding_transaction = t.FromHoldingTransaction == null ? null : new()
                {
                    id = t.FromHoldingTransaction.Id,
                    shares = t.FromHoldingTransaction.Shares,
                    price = t.FromHoldingTransaction.Price,
                },

            })
            .ToListAsync();
        return Ok(transactions);
    }
}
