using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Budget.Util;
using System.Diagnostics;

[Route("expenses")]
[ApiController]
public class ExpensesController : ControllerBase
{
    public class ExpenseTypeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
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
        public ExpenseVendorDto? Vendor { get; set; } // From Expense
        public bool Settled { get; set; } // From Expense
        public ExpenseTypeDto? ExpenseType { get; set; }
    }

    public class ExpenseVendorDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }

    private readonly ApplicationDbContext _context;

    private static ExpenseDto MapExpenseToDto(Expense expense)
    {
        var expenseDto = new ExpenseDto
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
            Vendor = expense.Vendor == null ? null : new ExpenseVendorDto
            {
                Id = expense.Vendor.Id,
                Name = expense.Vendor.Name,
                Description = expense.Vendor.Description
            }
        };

        if (expense.ExpenseType != null)
        {
            expenseDto.ExpenseType = new ExpenseTypeDto
            {
                Name = expense.ExpenseType.Name,
                Description = expense.ExpenseType.Description
            };
        }
        return expenseDto;
    }

    public ExpensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public async Task<List<ExpenseDto>> ListExpenses(string? type = "")
    {
        var userId = Util.getCurrentUserId(HttpContext);

        IQueryable<Expense> query = _context.Expenses
            .Include(e => e.Vendor)
            .Include(e => e.ExpenseType)
            .Where(e => e.AppUserId == userId);

        if (!string.IsNullOrEmpty(type))
        {
            var filterTypes = type.Split(
                ',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).ToList();

            query = query.Where(
                e => filterTypes.Select(f => f.ToLower()).Contains(e.ExpenseType.Name.ToLower())
            );
        }

        var expenses = await query.ToListAsync();

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
        var userId = Util.getCurrentUserId(HttpContext);

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
        string? userId = Util.getCurrentUserId(HttpContext);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        expense.AppUserId = userId;

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

        string? userId = Util.getCurrentUserId(HttpContext);

        Expense? expense = await _context.Expenses.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (expense != null)
        {
            _context.Expenses.Remove(expense);
        }

        await _context.SaveChangesAsync();
        return Ok(expense?.Id);
    }
}