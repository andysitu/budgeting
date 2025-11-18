using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddHoldingsDBContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Holding_Accounts_AccountId",
                table: "Holding");

            migrationBuilder.DropForeignKey(
                name: "FK_Holding_AspNetUsers_AppUserId",
                table: "Holding");

            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransaction_Holding_HoldingId",
                table: "HoldingTransaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Holding",
                table: "Holding");

            migrationBuilder.RenameTable(
                name: "Holding",
                newName: "Holdings");

            migrationBuilder.RenameIndex(
                name: "IX_Holding_AppUserId",
                table: "Holdings",
                newName: "IX_Holdings_AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Holding_AccountId",
                table: "Holdings",
                newName: "IX_Holdings_AccountId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Holdings",
                table: "Holdings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Holdings_Accounts_AccountId",
                table: "Holdings",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Holdings_AspNetUsers_AppUserId",
                table: "Holdings",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldingTransaction_Holdings_HoldingId",
                table: "HoldingTransaction",
                column: "HoldingId",
                principalTable: "Holdings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Holdings_Accounts_AccountId",
                table: "Holdings");

            migrationBuilder.DropForeignKey(
                name: "FK_Holdings_AspNetUsers_AppUserId",
                table: "Holdings");

            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransaction_Holdings_HoldingId",
                table: "HoldingTransaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Holdings",
                table: "Holdings");

            migrationBuilder.RenameTable(
                name: "Holdings",
                newName: "Holding");

            migrationBuilder.RenameIndex(
                name: "IX_Holdings_AppUserId",
                table: "Holding",
                newName: "IX_Holding_AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Holdings_AccountId",
                table: "Holding",
                newName: "IX_Holding_AccountId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Holding",
                table: "Holding",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Holding_Accounts_AccountId",
                table: "Holding",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Holding_AspNetUsers_AppUserId",
                table: "Holding",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldingTransaction_Holding_HoldingId",
                table: "HoldingTransaction",
                column: "HoldingId",
                principalTable: "Holding",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
