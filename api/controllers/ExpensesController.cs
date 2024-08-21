using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

[Route("expenses")]
[ApiController]
public class ExpensesController : ControllerBase
{
    private readonly ApplicationDbContext _context;


    public ExpensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public Task<List<Purchase>> ListPurchases()
    {
        Task<List<Purchase>> purchases = _context.Purchases.ToListAsync();

        return purchases;
    }

    [HttpGet("{id}", Name = "GetCommand")]
    public async Task<ActionResult<Purchase>> GetPurchaseById(long id)
    {
        Purchase? purchase = await _context.Purchases.FindAsync(id);

        if (purchase == null)
        {
            return NotFound();
        }

        string purchaseData = JsonSerializer.Serialize(purchase);

        return Ok(purchaseData);
    }


    [HttpPost("")]
    public async Task<ActionResult<Purchase>> CreatePurchase(Purchase p)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        p.AppUserId = userId;

        _context.Purchases.Add(p);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPurchaseById), new
        {
            id = p.Id
        }, p);
    }

}