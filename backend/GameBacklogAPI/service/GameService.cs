using GameBacklogAPI.Dto;
using GameBacklogAPI.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace GameBacklogAPI
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;

        public GameService(AppDbContext context)
        {
            _context = context;
        }

        public Task<bool> AddRatingAsync(int gameId, CreateRatingDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<GameDto?> CreateGameAsync(CreateGameDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteGameAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<GameDto?> GetGameByIdAsync(int id)
        {
            var game = await _context.Games
                .Include(g => g.Developer)
                .Include(g => g.Genres)
                .Include(g => g.Images)
                .Include(g => g.Ratings)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (game == null) return null;

            var dto = new GameDto
            {
                Id = game.Id,
                Title = game.Title,
                Description = game.Description,
                ReleaseDate = game.ReleaseDate,
                AverageRating = game.AverageRating,
                Developer = game.Developer?.Name,
                Genres = game.Genres.Select(g => g.Name).ToList(),
                /*
                Ratings = game.Ratings.Select(r => new RatingDto
                {
                    
                })
                */
                Images = game.Images.Select(img => new ImageDto
                {
                    Id = img.Id,
                    Url = img.Url
                }).ToList()
            };

            return dto;
        }

        public Task<bool> UpdateGameAsync(int id, CreateGameDto dto)
        {
            throw new NotImplementedException();
        }
    }
}