using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models.Accounts;

public class HoldingTransaction : BaseEntity
{
    public decimal Shares { get; set; } = 0;
    public decimal Price { get; set; } = 1;
    public long HoldingId { get; set; }

    [ForeignKey(nameof(HoldingId))]
    public virtual Holding Holding { get; set; } = null!;
    public virtual Transaction? SourceTransaction { get; set; }
    public virtual Transaction? DestinationTransaction { get; set; }
}