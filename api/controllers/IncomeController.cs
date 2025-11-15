using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Budget.Util;

[Route("income")]
[ApiController]
public class IncomeController : ControllerBase
{
    public class IncomeDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime? Date { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public long? VendorId { get; set; }
        public IncomeVendorDto? Vendor { get; set; }
    }

    public class IncomeVendorDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }

    private readonly ApplicationDbContext _context;

    private static IncomeDto MapIncomeToDto(Income income)
    {
        return new IncomeDto
        {
            Id = income.Id,
            Name = income.Name,
            Description = income.Description,
            Amount = income.Amount,
            Date = income.Date,
            StartDate = income.StartDate,
            EndDate = income.EndDate,
            VendorId = income.VendorId,
            Vendor = income.Vendor == null ? null : new IncomeVendorDto
            {
                Id = income.Vendor.Id,
                Name = income.Vendor.Name,
                Description = income.Vendor.Description
            }
        };
    }

    public IncomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public async Task<List<IncomeDto>> ListIncomes()
    {
        var userId = Util.getCurrentUserId(HttpContext);

        var query = _context.Income
            .Include(e => e.Vendor)
            .Where(e => e.AppUserId == userId)
            .AsQueryable();

        var incomes = await query
            .ToListAsync();

        var total = await query
            .CountAsync();

        // In your controller:
        var incomesDto = incomes.Select(i => MapIncomeToDto(i)).ToList();

        return incomesDto;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IncomeDto>> GetIncomeById(long id)
    {
        var userId = Util.getCurrentUserId(HttpContext);

        Income? income = await _context.Income
            .Where(e => e.Id == id && e.AppUserId == userId)
            .FirstAsync();

        if (income == null)
        {
            return NotFound();
        }

        var IncomeDto = MapIncomeToDto(income);

        return IncomeDto;
    }

    [Authorize]
    [HttpPost("")]
    public async Task<ActionResult<IncomeDto>> CreateIncome(Income income)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        income.AppUserId = userId;

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

        string? userId = Util.getCurrentUserId(HttpContext);

        Income? income = await _context.Income.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (income != null)
        {
            _context.Income.Remove(income);
        }

        await _context.SaveChangesAsync();
        return Ok(income?.Id);
    }
}