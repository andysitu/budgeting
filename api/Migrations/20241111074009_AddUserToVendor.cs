using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToVendor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Vendors",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vendors_AppUserId",
                table: "Vendors",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors");

            migrationBuilder.DropIndex(
                name: "IX_Vendors_AppUserId",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Vendors");
        }
    }
}
