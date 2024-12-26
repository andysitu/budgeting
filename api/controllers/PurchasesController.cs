using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Budget.Utilites;

[Route("purchases")]
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

    [HttpGet("{id}")]
    public async Task<ActionResult<Purchase>> GetPurchaseById(long id)
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        Purchase? purchase = await _context.Purchases.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (purchase == null)
        {
            return NotFound();
        }

        string purchaseData = JsonSerializer.Serialize(purchase);

        return Ok(purchaseData);
    }

    [Authorize]
    [HttpPost("")]
    public async Task<ActionResult<Purchase>> CreatePurchase(Purchase purchase)
    {
        string? userId = Utilites.getCurrentUserId(HttpContext);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        purchase.AppUserId = userId;

        if (purchase.VendorId.HasValue)
        {
            var vendor = await _context.Vendors.FindAsync(purchase.VendorId.Value);
            if (vendor == null)
            {
                return BadRequest("Vendor does not exist");
            }
            else if (vendor.AppUserId != userId)
            {
                return BadRequest("Vendor does not belong to the user");
            }
            purchase.Vendor = vendor;
        }

        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPurchaseById), new
        {
            id = purchase.Id
        }, purchase);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePurchase(long? id)
    {

        if (id == null)
        {
            return NotFound();
        }

        string? userId = Utilites.getCurrentUserId(HttpContext);

        Purchase? purchase = await _context.Purchases.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (purchase != null)
        {
            _context.Purchases.Remove(purchase);
        }

        await _context.SaveChangesAsync();
        return Ok(purchase?.Id);
    }
}