using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class PurchaseItem
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public required string Description { get; set; }

        public long PurchaseId { get; set; }
        public required Purchase Purchase { get; set; }
    }
}