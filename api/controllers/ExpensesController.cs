using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Budget.Utilites;

[Route("expenses")]
[ApiController]
public class ExpensesController : ControllerBase
{
    public class ExpenseDto
    {
        public long Id { get; set; } // From Expense
        public string Name { get; set; } // From Money
        public string? Description { get; set; } // From Money
        public decimal Amount { get; set; } // From Money
        public DateTime? Date { get; set; } // From Money
        public DateOnly? StartDate { get; set; } // From Money
        public DateOnly? EndDate { get; set; } // From Money
        public long? VendorId { get; set; } // From Expense
        public VendorDto? Vendor { get; set; } // From Expense
        public bool Settled { get; set; } // From Expense
    }

    public class VendorDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    private readonly ApplicationDbContext _context;

    private static ExpenseDto MapExpenseToDto(Expense expense)
    {
        return new ExpenseDto
        {
            Id = expense.Id,
            Name = expense.Name,
            Description = expense.Description,
            Amount = expense.Amount,
            Date = expense.Date,
            StartDate = expense.StartDate,
            EndDate = expense.EndDate,
            Settled = expense.Settled,
            VendorId = expense.VendorId,
            Vendor = expense.Vendor == null ? null : new VendorDto
            {
                Id = expense.Vendor.Id,
                Name = expense.Vendor.Name,
                Description = expense.Vendor.Description
            }
        };
    }

    public ExpensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public async Task<List<ExpenseDto>> ListExpenses()
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        var expenses = await _context.Expenses
                .Include(e => e.Vendor)
                .Where(e => e.AppUserId == userId)
                .ToListAsync();

        // In your controller:
        var expenseDtos = new List<ExpenseDto>();
        foreach (var expense in expenses)
        {
            var expenseDto = MapExpenseToDto(expense);
            expenseDtos.Add(expenseDto);
        }

        return expenseDtos;

    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseDto>> GetExpenseById(long id)
    {
        var userId = Utilites.getCurrentUserId(HttpContext);

        Expense? expense = await _context.Expenses
            .Where(e => e.Id == id && e.AppUserId == userId)
            .Include(e => e.Vendor)
            .FirstAsync();

        if (expense == null)
        {
            return NotFound();
        }

        var expenseDto = MapExpenseToDto(expense);

        return Ok(expenseDto);
    }

    [Authorize]
    [HttpPost("")]
    public async Task<ActionResult<Expense>> CreateExpense(Expense expense)
    {
        string? userId = Utilites.getCurrentUserId(HttpContext);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        expense.AppUserId = userId;

        if (expense.VendorId.HasValue)
        {
            var vendor = await _context.Vendors.FindAsync(expense.VendorId.Value);
            if (vendor == null)
            {
                return BadRequest("Vendor does not exist");
            }
            else if (vendor.AppUserId != userId)
            {
                return BadRequest("Vendor does not belong to the user");
            }
            expense.Vendor = vendor;
        }

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExpenseById), new
        {
            id = expense.Id
        }, expense);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExpense(long? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        string? userId = Utilites.getCurrentUserId(HttpContext);

        Expense? expense = await _context.Expenses.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (expense != null)
        {
            _context.Expenses.Remove(expense);
        }

        await _context.SaveChangesAsync();
        return Ok(expense?.Id);
    }
}