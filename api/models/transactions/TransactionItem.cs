namespace Budgeting.Models.Transactions;

public class TransactionItem : BaseEntity
{
    public long TransactionId { get; set; }
    public virtual Transaction Transaction { get; set; } = null!;

    // Positive amounts represent income; negative amounts represent expenses.
    public decimal Amount { get; set; }
    public virtual ICollection<Category> Categories { get; set; } = [];
    public string Description { get; set; } = "";
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
