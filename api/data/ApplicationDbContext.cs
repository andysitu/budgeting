using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Budgeting.Data
{
    public class AppUser : IdentityUser
    {
        [JsonIgnore]
        public override string? PasswordHash { get; set; }
    }


    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        { }

        public DbSet<Budgeting.Models.Pizza> Pizzas { get; set; }
        public DbSet<Budgeting.Models.Vendor> Vendors { get; set; }
        public DbSet<Budgeting.Models.Purchase> Purchases { get; set; }
        public DbSet<Budgeting.Models.PurchaseItem> PurchaseItems { get; set; }
        public DbSet<Budgeting.Models.Expense> Expenses { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost:5432;Database=budgeting;Username=budgetuser;Password=123abc");
    }
}