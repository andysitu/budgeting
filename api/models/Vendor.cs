using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Vendor
    {
        public long Id { get; set; }
        public required string Name { get; set; }
        public required ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    }
}