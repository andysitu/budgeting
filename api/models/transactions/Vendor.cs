namespace Budgeting.Models.Transactions
{
    public class Vendor : BaseEntity
    {
        public required string Name { get; set; }
        public string Description { get; set; } = "";
        public virtual ICollection<Transaction> Transactions { get; set; } = [];
    }
}
