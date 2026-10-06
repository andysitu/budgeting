namespace Budgeting.Models.Transactions;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public string Description { get; set; } = "";
    public virtual ICollection<TransactionItem> TransactionItems { get; set; } = [];
}
