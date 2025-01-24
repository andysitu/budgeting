using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Budgeting.Models;

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
        // Income instead of Incomes probably because I added the schema without adding it to this file
        public DbSet<Budgeting.Models.Income> Income { get; set; }
        public DbSet<Budgeting.Models.Account> Accounts { get; set; }
        public DbSet<Budgeting.Models.Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost:5432;Database=budgeting;Username=budgetuser;Password=123abc");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // For identity tables
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expense>()
                .Property(e => e.ExpenseType)
                .HasConversion<string>();

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.ToAccount)
                .WithMany(a => a.ToTransactions)
                .HasForeignKey(t => t.ToAccountId);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.FromAccount)
                .WithMany(a => a.FromTransactions)
                .HasForeignKey(t => t.FromAccountId);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity &&
                            (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;
                entity.UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }
        }
    }

}