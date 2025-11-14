using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AccountDto
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}

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

    private static AccountDto MapAccountToDto(Account account)
    {
        return new AccountDto
        {
            Id = account.Id,
            Name = account.Name,
            Description = account.Description,
        };
    }



    [HttpGet("")]
    public async Task<List<Account>> GetAccounts()
    {
        var userId = Util.getCurrentUserId(HttpContext);
        return new();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AccountDto>> GetAccountById(long id)
    {
        var userId = Util.getCurrentUserId(HttpContext);

        Account? account = await _context.Accounts.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (account == null)
        {
            return NotFound();
        }

        var AccountDto = MapAccountToDto(account);

        return AccountDto;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AccountDto>> CreateAccount([FromBody] AccountDto dto)
    {
        string? userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        Account account = new Account
        {
            Name = dto.Name,
            Description = dto.Description,
            AppUserId = userId
        };
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAccountById), new
        {
            id = account.Id
        }, account);
    }
}