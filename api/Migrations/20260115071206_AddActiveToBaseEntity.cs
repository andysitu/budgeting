using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddActiveToBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Vendors",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Transactions",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Pizzas",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "IncomeType",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Income",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "HoldingTransactions",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Holdings",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "ExpenseTypes",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Expenses",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "ExpenseItem",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Accounts",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Pizzas");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "IncomeType");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Income");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "HoldingTransactions");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Holdings");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "ExpenseTypes");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "ExpenseItem");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Accounts");
        }
    }
}
