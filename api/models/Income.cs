using System.ComponentModel.DataAnnotations.Schema;

namespace Budgeting.Models
{
    public class Income : Money
    {
        public long? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        public long IncomeTypeId { get; set; }
        [ForeignKey(nameof(IncomeTypeId))]
        public virtual IncomeType IncomeType { get; set; } = null!;
    }
}