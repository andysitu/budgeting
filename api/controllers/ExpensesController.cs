using Microsoft.EntityFrameworkCore;
using Budgeting.Data;
using Budgeting.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Budget.Utilites;

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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        Task<List<Expense>> expenses = _context.Expenses.Where(e => e.AppUserId == userId).ToListAsync();

        return expenses;
    }

    [HttpGet("{id}", Name = "GetCommand")]
    public async Task<ActionResult<Expense>> GetExpenseById(long id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        Expense? expense = await _context.Expenses.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

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

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        Expense? expense = await _context.Expenses.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (expense != null)
        {
            _context.Expenses.Remove(expense);
        }

        await _context.SaveChangesAsync();
        return Ok(expense?.Id);
    }
}