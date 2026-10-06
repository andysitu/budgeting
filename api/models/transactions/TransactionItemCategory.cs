namespace Budgeting.Models.Transactions;

public class TransactionItemCategory
{
    public long TransactionItemId { get; set; }
    public virtual TransactionItem TransactionItem { get; set; } = null!;
    public long CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
}
