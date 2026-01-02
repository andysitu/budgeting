using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Budgeting.Models;
using Budgeting.Models.Accounts;

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
        public DbSet<Budgeting.Models.ExpenseType> ExpenseTypes { get; set; }
        public DbSet<Budgeting.Models.Expense> Expenses { get; set; }
        // Income instead of Incomes probably because I added the schema without adding it to this file
        public DbSet<Budgeting.Models.Income> Income { get; set; }
        public DbSet<Budgeting.Models.Accounts.Account> Accounts { get; set; }
        public DbSet<Budgeting.Models.Accounts.Holding> Holdings { get; set; }

        public DbSet<Budgeting.Models.Accounts.Transaction> Transactions { get; set; }
        public DbSet<Budgeting.Models.Accounts.HoldingTransaction> HoldingTransactions { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddJsonFile($"appsettings.Development.json", optional: true)
                    .Build();

                var connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseNpgsql(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasOne(e => e.FromHoldingTransaction)
                .WithOne(e => e.DestinationTransaction)
                .HasForeignKey<Transaction>(e => e.FromHoldingTransactionId);

            modelBuilder.Entity<Transaction>()
                .HasOne(e => e.ToHoldingTransaction)
                .WithOne(e => e.SourceTransaction)
                .HasForeignKey<Transaction>(e => e.ToHoldingTransactionId)
                .IsRequired();

            // For identity tables
            base.OnModelCreating(modelBuilder);
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