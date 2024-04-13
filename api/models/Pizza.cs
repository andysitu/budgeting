using Budgeting.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgeting.Models
{
    public class Pizza
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}