using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Expense
    {
        public long Id { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public long VendorId { get; set; }
        public Vendor? Vendor { get; set; }
    }
}