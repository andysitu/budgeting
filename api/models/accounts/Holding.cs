using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models.Accounts;

public class Holding : BaseEntity
{
    public required string Name { get; set; }
    public decimal Shares { get; set; } = 0;
    public decimal Price { get; set; } = 1;
    public bool IsMonetary { get; set; } = false;
    public required long AccountId { get; set; }
    [ForeignKey(nameof(AccountId))]
    public virtual Account? Account { get; set; }
}