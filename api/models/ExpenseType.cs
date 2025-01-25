namespace Budgeting.Models
{
    public class ExpenseType : BaseEntity
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = "";
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}