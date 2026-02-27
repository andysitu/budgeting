using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models.Accounts;

public class HoldingLog : BaseEntity
{
    public decimal OldShares { get; set; } = 0;
    public decimal NewShares { get; set; } = 0;
    public decimal OldPrice { get; set; } = 1;
    public decimal NewPrice { get; set; } = 1;
    public long HoldingId { get; set; }

    [ForeignKey(nameof(HoldingId))]
    public virtual Holding Holding { get; set; } = null!;
}