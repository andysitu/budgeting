namespace Budgeting.Models
{
    public class ExpenseType : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = "";
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}