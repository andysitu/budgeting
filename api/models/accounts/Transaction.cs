using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models.Accounts;

public class Transaction : BaseEntity
{
    public DateTime Date { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public long? VendorId { get; set; }
    [ForeignKey(nameof(VendorId))]
    public virtual Vendor? Vendor { get; set; }
    [Comment("Whether the payment has been paid or received.")]
    public bool Settled { get; set; } = true;
    public virtual ICollection<TransactionItem> TransactionItems { get; set; } = [];
    [Comment("Whether this transaction affects holding balances when settled.")]
    public bool ModifiedHolding { get; set; } = true;
    public long? ToHoldingTransactionId { get; set; }
    public long? FromHoldingTransactionId { get; set; } = null;

    [ForeignKey(nameof(ToHoldingTransactionId))]
    public virtual HoldingTransaction? ToHoldingTransaction { get; set; }

    // Decided with a negative or positive ToHoldingTrans will affect the Holding amount,
    // rather than have it be To or From HT since the calculation is simpler.
    [ForeignKey(nameof(FromHoldingTransactionId))]
    public virtual HoldingTransaction? FromHoldingTransaction { get; set; }
}
