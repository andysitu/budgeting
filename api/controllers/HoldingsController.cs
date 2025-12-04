using Budgeting.Data;
using Budgeting.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class HoldingTransferDto
{
    public long from_holding_id { get; set; }
    public long to_holding_id { get; set; }
    public long from_shares { get; set; }
    public long to_shares { get; set; }
}

[Authorize]
[ApiController]
[Route("holdings")]
public class HoldingsController : Controller
{
    private readonly ApplicationDbContext _context;
    public HoldingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("transfer")]
    public async Task<ActionResult> TranserHoldings([FromBody] HoldingTransferDto holdingTransferDto)
    {
        Holding? fromHolding = await _context.Holdings.Where(h => h.Id == holdingTransferDto.from_holding_id).SingleAsync();
        if (fromHolding == null)
        {
            return NotFound();
        }

        Holding? toHolding = await _context.Holdings.Where(h => h.Id == holdingTransferDto.to_holding_id).SingleAsync();
        if (toHolding == null)
        {
            return NotFound();
        }

        if (holdingTransferDto.from_shares > fromHolding.Shares)
        {
            return BadRequest("Not enough shares to transfer out of the holding");
        }
        else if (holdingTransferDto.to_shares <= 0)
        {
            return BadRequest("Need a positive shares to transfer to the new holding");
        }

        fromHolding.Shares -= holdingTransferDto.from_shares;
        toHolding.Shares += holdingTransferDto.to_shares;

        await _context.SaveChangesAsync();

        return Ok();
    }
}