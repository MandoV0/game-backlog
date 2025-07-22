using GameBacklogAPI.Model;

namespace GameBacklogAPI.Model
{
    public class GameImage
    {
        public int Id { get; set; }
        public required string Url { get; set; }

        public int GameId { get; set; }
        public required Game Game { get; set; }
    }
}