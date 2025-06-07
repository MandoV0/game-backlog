using GameBacklogAPI.Dto;
using GameBacklogAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly AppDbContext _context;

    public GameController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Game>>> Get()
    {
        var games = await _context.Games
            .Include(g => g.Images)
            .ToListAsync();

        var gameDtos = games.Select(
            game => new GameDto
            {
                Id = game.Id,
                Title = game.Title,
                Genre = game.Genre,
                Platform = game.Platform,
                ReleaseDate = game.ReleaseDate,
                Description = game.Description,
                ImageUrls = game.Images.Select(img => img.Url).ToList()
            }
        ).ToList();

        return Ok(gameDtos);
    }

    public async Task<ActionResult<Game>> Post(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = game.Id }, game);
    }

    public async Task<ActionResult<Game>> Put(int id, Game game)
    {
        if (id != game.Id)
        {
            return BadRequest();
        }

        _context.Entry(game).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Games.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }
}