using Budgeting.Data;

namespace Budgeting.Models
{
    public class Account : BaseEntity
    {
        public virtual ICollection<Transaction> ToTransactions { get; set; }
            = new List<Transaction>();
        public virtual ICollection<Transaction> FromTransactions { get; set; }
            = new List<Transaction>();

        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;
    }
}