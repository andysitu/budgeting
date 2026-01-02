using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models.Accounts
{
    public class Transaction : BaseEntity
    {
        public DateTime Date { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public decimal Amount { get; set; }
        [Comment("If the transaction affected the holding price/shares.")]
        public bool ModifiedHolding { get; set; } = true;

        public long ToHoldingTransactionId { get; set; }
        public long? FromHoldingTransactionId { get; set; } = null;

        [ForeignKey(nameof(ToHoldingTransactionId))]
        public virtual HoldingTransaction ToHoldingTransaction { get; set; } = null!;
        [ForeignKey(nameof(FromHoldingTransactionId))]
        public virtual HoldingTransaction FromHoldingTransaction { get; set; } = null!;
    }
}