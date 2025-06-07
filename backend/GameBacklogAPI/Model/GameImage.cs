using GameBacklogAPI.Model;

namespace GameBacklogAPI.Model
{
    public class GameImage
    {
        public int Id { get; set; }
        public string Url { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; }
    }
}