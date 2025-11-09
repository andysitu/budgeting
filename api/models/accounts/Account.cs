using Budgeting.Data;

namespace Budgeting.Models.Accounts;

public class Account : BaseEntity
{
    public required string Name { get; set; }
    public string Description { get; set; } = "";

    public virtual ICollection<Holding> Holdings { get; set; }
        = new List<Holding>();
}