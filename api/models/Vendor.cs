using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Vendor
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = "";
        public required ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public required ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public required ICollection<Income> Incomes { get; set; } = new List<Income>();
    }
}