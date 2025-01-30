using Budgeting.Data;

namespace Budgeting.Models
{
    public class Vendor : BaseEntity
    {
        public required string Name { get; set; }
        public string Description { get; set; } = "";
        public ICollection<Expense> Expenses { get; set; } = [];
        public ICollection<Income> Incomes { get; set; } = [];
    }
}