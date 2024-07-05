using Budgeting.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Authorize]
[ApiController]
[Route("account")]
public class AccountController : Controller
{
    private readonly UserManager<AppUser> userManager;

    public AccountController(UserManager<AppUser> userManager)
    {
        this.userManager = userManager;
    }

    private Task<AppUser?> GetCurrentUserAsync() => userManager.GetUserAsync(HttpContext.User);

    [HttpGet("me")]
    public async Task<string?> GetCurrentUserId()
    {
        AppUser? user = await GetCurrentUserAsync();
        return user?.Id;
    }
}