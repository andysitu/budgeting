using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Income : Money
    {
        public long? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
    }
}