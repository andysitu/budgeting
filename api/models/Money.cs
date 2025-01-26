using Budgeting.Data;

namespace Budgeting.Models
{
    public abstract class Money : BaseEntity
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime? Date { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }
}