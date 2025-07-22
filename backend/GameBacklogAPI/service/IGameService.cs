using GameBacklogAPI.Dto;

namespace GameBacklogAPI.Service
{

    public interface IGameService
    {
        Task<GameDto?> GetGameByIdAsync(int id);
        Task<GameDto?> CreateGameAsync(CreateGameDto dto);
        Task<bool> UpdateGameAsync(int id, CreateGameDto dto);
        Task<bool> DeleteGameAsync(int id);
        Task<bool> AddRatingAsync(int gameId, CreateRatingDto dto);
    }
}