namespace Budgeting.Models
{
    public class PurchaseItem : BaseEntity
    {
        public decimal Amount { get; set; }
        public required string Description { get; set; }

        public long PurchaseId { get; set; }
        public required Purchase Purchase { get; set; }
    }
}