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
}