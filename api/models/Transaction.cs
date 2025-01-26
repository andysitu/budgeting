using System.ComponentModel.DataAnnotations.Schema;
using Budgeting.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models
{
    public class Transaction : BaseEntity
    {
        public long ToAccountId { get; set; }
        public long? FromAccountId { get; set; }
        public DateTime Date { get; set; }
        [ForeignKey(nameof(ToAccountId))]
        public virtual Account ToAccount { get; set; } = null!;
        [ForeignKey(nameof(FromAccountId))]
        public virtual Account? FromAccount { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Amount { get; set; }
    }
}