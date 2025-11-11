using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[Authorize]
[ApiController]
[Route("accounts")]
public class AccountsController : Controller
{
    private readonly ApplicationDbContext _context;
    public AccountsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public async Task<List<Account>> GetAccounts()
    {
        var userId = Util.getCurrentUserId(HttpContext);
        return new();
    }

    [HttpPost]
    public async Task CreateAccount()
    {

    }
}