using Budgeting.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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

    private async Task<AppUser?> GetCurrentUserAsync()
    {
        AppUser? user = await userManager.GetUserAsync(HttpContext.User);

        return user;
    }

    [HttpGet("me")]
    public async Task<ActionResult<AppUser?>> GetCurrentUserId()
    {
        AppUser? user = await GetCurrentUserAsync();

        var userData = Json(user);

        Console.WriteLine(userData);

        return Ok(user);
    }
}