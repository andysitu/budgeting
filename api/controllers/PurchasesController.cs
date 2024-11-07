using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;

[Route("purchase")]
[ApiController]
public class PurchasesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PurchasesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public Task<List<Purchase>> ListPurchases()
    {
        Task<List<Purchase>> purchases = _context.Purchases.ToListAsync();

        return purchases;
    }
}