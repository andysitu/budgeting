namespace Budgeting.Models.Accounts;

public class HoldingType : BaseEntity
{
    public required string Name { get; set; }
    public string Description { get; set; } = "";
    public virtual ICollection<Holding> Holdings { get; set; } = [];
}

public class HoldingHoldingType
{
    public long HoldingId { get; set; }
    public virtual Holding Holding { get; set; } = null!;
    public long HoldingTypeId { get; set; }
    public virtual HoldingType HoldingType { get; set; } = null!;
}
