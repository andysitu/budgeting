namespace Budgeting.Models
{
    public enum ExpenseType
    {
        Purchase
    }

    public class Expense : Money
    {
        public long? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        public bool Settled { get; set; } = false;

        public ExpenseType? ExpenseType { get; set; } = null;

        public virtual ICollection<ExpenseItem> ExpenseItems { get; set; } = [];
    }
}