using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Budget.Utilites;

[Route("income")]
[ApiController]
public class IncomeController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public IncomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public Task<List<Income>> ListIncomes()
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        Task<List<Income>> incomes = _context.Income.Where(e => e.AppUserId == userId).ToListAsync();

        return incomes;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Income>> GetIncomeById(long id)
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        Income? income = await _context.Income.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (income == null)
        {
            return NotFound();
        }

        string incomeData = JsonSerializer.Serialize(income);

        return Ok(incomeData);
    }

    [Authorize]
    [HttpPost("")]
    public async Task<ActionResult<Income>> CreateIncome(Income income)
    {
        string? userId = Utilites.getCurrentUserId(HttpContext);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        income.AppUserId = userId;

        if (income.VendorId.HasValue)
        {
            var vendor = await _context.Vendors.FindAsync(income.VendorId.Value);
            if (vendor == null)
            {
                return BadRequest("Vendor does not exist");
            }
            else if (vendor.AppUserId != userId)
            {
                return BadRequest("Vendor does not belong to the user");
            }
            income.Vendor = vendor;
        }

        _context.Income.Add(income);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetIncomeById), new
        {
            id = income.Id
        }, income);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteIncome(long? id)
    {

        if (id == null)
        {
            return NotFound();
        }

        string? userId = Utilites.getCurrentUserId(HttpContext);

        Income? income = await _context.Income.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (income != null)
        {
            _context.Income.Remove(income);
        }

        await _context.SaveChangesAsync();
        return Ok(income?.Id);
    }
}