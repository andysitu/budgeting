namespace Budgeting.Models
{
    public class ExpenseItem : BaseEntity
    {
        public decimal Amount { get; set; }
        public required string Description { get; set; }

        public long ExpenseId { get; set; }
        public required Expense Expense { get; set; }
    }
}