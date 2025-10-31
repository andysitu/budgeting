using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace Budget.Utilites
{
    public static class Utilites
    {
        public static string? getCurrentUserId(HttpContext httpContext)
        {
            // ClaimTypes.NameIdentifier gets the identifier (user in this case)
            return httpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}