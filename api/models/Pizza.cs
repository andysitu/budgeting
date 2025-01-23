using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Pizza : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}