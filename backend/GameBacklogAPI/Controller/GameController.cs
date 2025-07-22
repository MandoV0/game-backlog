using GameBacklogAPI.Dto;
using GameBacklogAPI.Service;
using Microsoft.AspNetCore.Mvc;

namespace GameBacklogAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService service)
        {
            _gameService = service;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var game = await _gameService.GetGameByIdAsync(id);
            return game is null ? NotFound() : Ok(game);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int id, [FromBody] CreateGameDto dto)
        {
            var game = await _gameService.CreateGameAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = game.Id }, game);
        }
    }
}