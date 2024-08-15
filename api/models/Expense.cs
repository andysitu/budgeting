using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Expense : Money
    {
        public long? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        public bool Settled { get; set; } = false;
    }
}