using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using Budgeting.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Extensions.Options;
using Budgeting.Data;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("ApplicationDbContext")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo {
        Title = "Budgeting API",
        Version = "v1"
    });
});



builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Budget API V1");
});

app.MapIdentityApi<IdentityUser>();

app.MapGet("/", () => "Hello World!");

app.MapGet("/pizzas", async (ApplicationDbContext db) => await db.Pizzas.ToListAsync());

app.MapPost("/pizza", async (ApplicationDbContext db, Pizza pizza) => {
    await db.Pizzas.AddAsync(pizza);
    await db.SaveChangesAsync();
    return Results.Created($"/pizza/{pizza.Id}", pizza);
});

app.MapGet("/pizza/{id}", async (ApplicationDbContext db, int id) => await db.Pizzas.FindAsync(id));

app.MapPut("/pizza/{id}", async (ApplicationDbContext db, Pizza updatePizza, int id) => {
    var pizza = await db.Pizzas.FindAsync(id);
    if (pizza is null) return Results.NotFound();
    pizza.Name = updatePizza.Name;
    pizza.Description = updatePizza.Description;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapDelete("/pizza/{id}", async (ApplicationDbContext db, int id) => {
    var pizza = await db.Pizzas.FindAsync(id);
    if (pizza is null) {
        return Results.NotFound();
    }
    db.Pizzas.Remove(pizza);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();
