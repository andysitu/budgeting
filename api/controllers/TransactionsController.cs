
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class TransactionDto 
{
    public long id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public decimal amount { get; set; }
    public bool modified_holding { get; set; }
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
            })
            .ToListAsync();
        return Ok(transactions);
    }
}
