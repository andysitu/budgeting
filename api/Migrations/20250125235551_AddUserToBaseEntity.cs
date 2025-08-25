using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Vendors",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Purchases",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "PurchaseItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Pizzas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Income",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "ExpenseTypes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Expenses",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "ExpenseItem",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseItems_AppUserId",
                table: "PurchaseItems",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Pizzas_AppUserId",
                table: "Pizzas",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseTypes_AppUserId",
                table: "ExpenseTypes",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseItem_AppUserId",
                table: "ExpenseItem",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpenseItem_AspNetUsers_AppUserId",
                table: "ExpenseItem",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_AspNetUsers_AppUserId",
                table: "Expenses",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExpenseTypes_AspNetUsers_AppUserId",
                table: "ExpenseTypes",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Income_AspNetUsers_AppUserId",
                table: "Income",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pizzas_AspNetUsers_AppUserId",
                table: "Pizzas",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseItems_AspNetUsers_AppUserId",
                table: "PurchaseItems",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Purchases_AspNetUsers_AppUserId",
                table: "Purchases",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpenseItem_AspNetUsers_AppUserId",
                table: "ExpenseItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_AspNetUsers_AppUserId",
                table: "Expenses");

            migrationBuilder.DropForeignKey(
                name: "FK_ExpenseTypes_AspNetUsers_AppUserId",
                table: "ExpenseTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Income_AspNetUsers_AppUserId",
                table: "Income");

            migrationBuilder.DropForeignKey(
                name: "FK_Pizzas_AspNetUsers_AppUserId",
                table: "Pizzas");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseItems_AspNetUsers_AppUserId",
                table: "PurchaseItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchases_AspNetUsers_AppUserId",
                table: "Purchases");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseItems_AppUserId",
                table: "PurchaseItems");

            migrationBuilder.DropIndex(
                name: "IX_Pizzas_AppUserId",
                table: "Pizzas");

            migrationBuilder.DropIndex(
                name: "IX_ExpenseTypes_AppUserId",
                table: "ExpenseTypes");

            migrationBuilder.DropIndex(
                name: "IX_ExpenseItem_AppUserId",
                table: "ExpenseItem");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "PurchaseItems");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Pizzas");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "ExpenseTypes");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "ExpenseItem");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Vendors",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Purchases",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Income",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Expenses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_AspNetUsers_AppUserId",
                table: "Vendors",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
