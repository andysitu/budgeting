using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddReferenceForHoldingTrans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransaction_AspNetUsers_AppUserId",
                table: "HoldingTransaction");

            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransaction_Holdings_HoldingId",
                table: "HoldingTransaction");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_HoldingTransaction_FromHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_HoldingTransaction_ToHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FromHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_ToHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HoldingTransaction",
                table: "HoldingTransaction");

            migrationBuilder.RenameTable(
                name: "HoldingTransaction",
                newName: "HoldingTransactions");

            migrationBuilder.RenameIndex(
                name: "IX_HoldingTransaction_HoldingId",
                table: "HoldingTransactions",
                newName: "IX_HoldingTransactions_HoldingId");

            migrationBuilder.RenameIndex(
                name: "IX_HoldingTransaction_AppUserId",
                table: "HoldingTransactions",
                newName: "IX_HoldingTransactions_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HoldingTransactions",
                table: "HoldingTransactions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FromHoldingTransactionId",
                table: "Transactions",
                column: "FromHoldingTransactionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ToHoldingTransactionId",
                table: "Transactions",
                column: "ToHoldingTransactionId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldingTransactions_AspNetUsers_AppUserId",
                table: "HoldingTransactions",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HoldingTransactions_Holdings_HoldingId",
                table: "HoldingTransactions",
                column: "HoldingId",
                principalTable: "Holdings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_HoldingTransactions_FromHoldingTransactionId",
                table: "Transactions",
                column: "FromHoldingTransactionId",
                principalTable: "HoldingTransactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_HoldingTransactions_ToHoldingTransactionId",
                table: "Transactions",
                column: "ToHoldingTransactionId",
                principalTable: "HoldingTransactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransactions_AspNetUsers_AppUserId",
                table: "HoldingTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_HoldingTransactions_Holdings_HoldingId",
                table: "HoldingTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_HoldingTransactions_FromHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_HoldingTransactions_ToHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FromHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_ToHoldingTransactionId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HoldingTransactions",
                table: "HoldingTransactions");

            migrationBuilder.RenameTable(
                name: "HoldingTransactions",
                newName: "HoldingTransaction");

            migrationBuilder.RenameIndex(
                name: "IX_HoldingTransactions_HoldingId",
                table: "HoldingTransaction",
                newName: "IX_HoldingTransaction_HoldingId");

            migrationBuilder.RenameIndex(
                name: "IX_HoldingTransactions_AppUserId",
                table: "HoldingTransaction",
                newName: "IX_HoldingTransaction_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HoldingTransaction",
                table: "HoldingTransaction",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FromHoldingTransactionId",
                table: "Transactions",
                column: "FromHoldingTransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ToHoldingTransactionId",
                table: "Transactions",
                column: "ToHoldingTransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_HoldingTransaction_AspNetUsers_AppUserId",
                table: "HoldingTransaction",
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

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_HoldingTransaction_FromHoldingTransactionId",
                table: "Transactions",
                column: "FromHoldingTransactionId",
                principalTable: "HoldingTransaction",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_HoldingTransaction_ToHoldingTransactionId",
                table: "Transactions",
                column: "ToHoldingTransactionId",
                principalTable: "HoldingTransaction",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
