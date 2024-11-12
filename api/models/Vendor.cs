using Budgeting.Data;
using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Vendor
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = "";

        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
        public ICollection<Purchase> Purchases { get; set; } = [];
        public ICollection<Expense> Expenses { get; set; } = [];
        public ICollection<Income> Incomes { get; set; } = [];
    }
}