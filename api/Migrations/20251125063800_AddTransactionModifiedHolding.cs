using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionModifiedHolding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ModifiedHolding",
                table: "Transactions",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                comment: "If the transaction affected the holding price/shares.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedHolding",
                table: "Transactions");
        }
    }
}
