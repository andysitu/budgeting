using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class HoldingDataDto
{
    public string Name { get; set; } = "";
    public decimal Shares { get; set; } = 0;
    public decimal Price { get; set; } = 1;
}
public class HoldingDto
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Shares { get; set; } = 0;
    public decimal Price { get; set; } = 1;
}
public class AccountDto
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public List<Holding> Holdings { get; set; } = [];
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
    public async Task<List<AccountDto>> ListAccounts()
    {
        var userId = Util.getCurrentUserId(HttpContext);
        var query = _context.Accounts
            .Where(a => a.AppUserId == userId)
            .Include(a => a.Holdings)
            .AsQueryable();

        var total = await query.CountAsync();

        var accounts = await query.ToListAsync();

        var accountsDto = accounts.Select(a => new AccountDto
        {
            Id = a.Id,
            Name = a.Name,
            Description = a.Description,
            Holdings = a.Holdings.ToList(),
        }).ToList();
        return accountsDto;
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

    public class HoldingListWrapperDto
    {
        public required List<HoldingDataDto> Holdings { get; set; }
    }

    [Authorize]
    [HttpPost("{id}/holdings")]
    public async Task<ActionResult> CreateHoldings(
            long id, [FromBody] HoldingListWrapperDto wrapper)
    {
        var userId = Util.getCurrentUserId(HttpContext);
        if (userId == null)
        {
            return NotFound();
        }

        Account? account = await _context.Accounts.Where(e => e.Id == id && e.AppUserId == userId).FirstAsync();

        if (account == null)
        {
            return NotFound();
        }

        List<HoldingDataDto> holdings = wrapper.Holdings;
        List<Holding> holdingsToAdd = new();

        if (holdings == null || holdings.Count == 0)
            return BadRequest("Empty Holdings provided");
        foreach (HoldingDataDto holding in holdings)
        {
            holdingsToAdd.Add(new Holding
            {
                Name = holding.Name,
                Shares = holding.Shares,
                Price = holding.Price,
                AccountId = id,
                AppUserId = userId,
            });
        }

        _context.Holdings.AddRange(holdingsToAdd);
        await _context.SaveChangesAsync();

        return Ok();
    }
}