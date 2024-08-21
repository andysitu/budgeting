using Budgeting.Data;
using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public abstract class Money
    {
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime? Date { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
    }
}