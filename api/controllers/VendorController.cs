using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Budget.Utilites;

[Route("vendor")]
[ApiController]
public class VendorController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VendorController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public Task<List<Vendor>> ListVendors()
    {
        Task<List<Vendor>> vendors = _context.Vendors.ToListAsync();

        return vendors;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vendor>> GetVendorById(long id)
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        Vendor? vendor = await _context.Vendors.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (vendor == null)
        {
            return NotFound();
        }

        string vendorData = JsonSerializer.Serialize(vendor);

        return Ok(vendorData);
    }

    [Authorize]
    [HttpPost("")]
    public async Task<ActionResult<Vendor>> CreateVendor(Vendor vendor)
    {
        string? userId = Utilites.getCurrentUserId(HttpContext);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        vendor.AppUserId = userId;

        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetVendorById), new
        {
            id = vendor.Id
        }, vendor);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteVendor(long? id)
    {

        if (id == null)
        {
            return NotFound();
        }

        string? userId = Utilites.getCurrentUserId(HttpContext);

        Vendor? vendor = await _context.Vendors.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (vendor != null)
        {
            _context.Vendors.Remove(vendor);
        }

        await _context.SaveChangesAsync();
        return Ok(vendor?.Id);
    }
}