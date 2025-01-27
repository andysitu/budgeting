namespace Budgeting.Models
{
    public class IncomeType : BaseEntity
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = "";
        public virtual ICollection<Income> Income { get; set; } = new List<Income>();
    }
}