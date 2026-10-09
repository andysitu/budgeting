using Budget.Util;
using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public record HoldingTypeDto(long Id, string Name, string Description, bool Active)
{
    public static HoldingTypeDto From(HoldingType type) =>
        new(type.Id, type.Name, type.Description, type.Active);
}

public class HoldingTypeDataDto
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public bool Active { get; set; } = true;
}

[Authorize]
[ApiController]
[Route("holding-types")]
public class HoldingTypesController(ApplicationDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<List<HoldingTypeDto>> List() => await context.HoldingTypes
        .Where(t =>
            t.AppUserId == Util.getCurrentUserId(HttpContext))
        .OrderBy(t => t.Name)
        .Select(t =>
            new HoldingTypeDto(t.Id, t.Name, t.Description, t.Active))
        .ToListAsync();

    [HttpPost]
    public async Task<ActionResult<HoldingTypeDto>> Create(HoldingTypeDataDto dto)
    {
        var userId = Util.getCurrentUserId(HttpContext);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var name = dto.Name.Trim();

        if (name.Length == 0)
        {
            return BadRequest("Type name is required.");
        }

        if (await context.HoldingTypes.AnyAsync(
            t => t.AppUserId == userId && t.Name.ToLower() == name.ToLower()))
        {
            return Conflict("A holding type with this name already exists.");
        }

        var type = new HoldingType
        {
            Name = name,
            Description = dto.Description.Trim(),
            Active = dto.Active,
            AppUserId = userId
        };

        context.HoldingTypes.Add(type);

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is Npgsql.PostgresException { SqlState: "23505" })
        {
            return Conflict("A holding type with this name already exists.");
        }
        return StatusCode(201, HoldingTypeDto.From(type));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HoldingTypeDto>> Update(long id, HoldingTypeDataDto dto)
    {
        var userId = Util.getCurrentUserId(HttpContext);

        var type = await context.HoldingTypes.FirstOrDefaultAsync(
            t => t.Id == id && t.AppUserId == userId);

        if (type == null) return NotFound();

        var name = dto.Name.Trim();
        if (name.Length == 0)
        {
            return BadRequest("Type name is required.");
        }

        if (await context.HoldingTypes.AnyAsync(
            t =>
                t.AppUserId == userId &&
                t.Id != id &&
                t.Name.ToLower() == name.ToLower())
        )
        {
            return Conflict("A holding type with this name already exists.");
        }
        type.Name = name;
        type.Description = dto.Description.Trim();
        type.Active = dto.Active;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is Npgsql.PostgresException { SqlState: "23505" })
        {
            return Conflict("A holding type with this name already exists.");
        }
        return HoldingTypeDto.From(type);
    }
}
