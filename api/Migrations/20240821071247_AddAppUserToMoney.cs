using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddAppUserToMoney : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Purchases",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Income",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Expenses",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Purchases_AppUserId",
                table: "Purchases",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Income_AppUserId",
                table: "Income",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_AppUserId",
                table: "Expenses",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_AspNetUsers_AppUserId",
                table: "Expenses",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Income_AspNetUsers_AppUserId",
                table: "Income",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Purchases_AspNetUsers_AppUserId",
                table: "Purchases",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_AspNetUsers_AppUserId",
                table: "Expenses");

            migrationBuilder.DropForeignKey(
                name: "FK_Income_AspNetUsers_AppUserId",
                table: "Income");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchases_AspNetUsers_AppUserId",
                table: "Purchases");

            migrationBuilder.DropIndex(
                name: "IX_Purchases_AppUserId",
                table: "Purchases");

            migrationBuilder.DropIndex(
                name: "IX_Income_AppUserId",
                table: "Income");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_AppUserId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Income");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Expenses");
        }
    }
}
