using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RenameExpenseTypeColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "ExpenseTypes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "ExpenseTypes",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ExpenseTypes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "ExpenseTypes",
                newName: "description");
        }
    }
}
