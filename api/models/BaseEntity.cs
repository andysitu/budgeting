using Budgeting.Data;
using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public abstract class BaseEntity
    {
        public int Id { get; set; } // Or Guid if you prefer
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}