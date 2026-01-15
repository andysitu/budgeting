using Budgeting.Data;

namespace Budgeting.Models
{
    public abstract class BaseEntity
    {
        public long Id { get; set; } // Or Guid if you prefer
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public bool Active { get; set; } = true;

        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;
    }
}