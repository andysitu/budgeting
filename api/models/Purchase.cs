namespace Budgeting.Models
{
    public class Purchase : Money
    {
        public long? VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public ICollection<PurchaseItem> PurchaseItems { get; set; } = [];
    }
}