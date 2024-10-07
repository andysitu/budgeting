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
    public Task<List<Expense>> ListExpenses()
    {
        Task<List<Expense>> expenses = _context.Expenses.ToListAsync();

        return expenses;
    }

    [HttpGet("{id}", Name = "GetCommand")]
    public async Task<ActionResult<Expense>> GetExpenseById(long id)
    {
        Expense? expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        string expenseData = JsonSerializer.Serialize(expense);

        return Ok(expenseData);
    }


    [HttpPost("")]
    public async Task<ActionResult<Expense>> CreateExpense(Expense e)
    {
        // ClaimTypes.NameIdentifier gets the identifier (user in this case)
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        e.AppUserId = userId;

        _context.Expenses.Add(e);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExpenseById), new
        {
            id = e.Id
        }, e);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExpense(long? id)
    {

        if (id == null)
        {
            return NotFound();
        }

        Console.WriteLine("Hello");
        var expense = await _context.Expenses.FindAsync(id);
        Console.WriteLine("Hello1");
        if (expense != null)
        {
            _context.Expenses.Remove(expense);
        }

        await _context.SaveChangesAsync();
        return Ok(expense?.Id);
    }
}