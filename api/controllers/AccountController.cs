using Budgeting.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[Authorize]
[ApiController]
[Route("account")]
public class AccountController : Controller
{
    private readonly UserManager<AppUser> _userManager;

    public AccountController(UserManager<AppUser> userManager)
    {
        this._userManager = userManager;
    }

    private async Task<AppUser?> GetCurrentUserAsync()
    {
        AppUser? user = await _userManager.GetUserAsync(HttpContext.User);

        return user;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUserId()
    {
        AppUser? user = await GetCurrentUserAsync();

        if (user == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, "User not logged in");
        }

        string userData = JsonSerializer.Serialize(user);

        return Ok(userData);
    }
}