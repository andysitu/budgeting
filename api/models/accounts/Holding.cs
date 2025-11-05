using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Budgeting.Models.Accounts;

public class Holding: BaseEntity
{
    public required string Name { get; set; }
    public decimal Shares { get; set; } = 0;
    public decimal Price { get; set; } = 1;

    public long AccountId { get; set; }
    public required Account Account { get; set; }
}