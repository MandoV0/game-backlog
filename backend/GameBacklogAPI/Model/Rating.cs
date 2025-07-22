namespace GameBacklogAPI.Model
{
    public class Rating
    {
        public int Id { get; set; }
        public required int Stars { get; set; }
        public string? Comment { get; set; }

        public required int GameId { get; set; }
        public required Game Game { get; set; }
    }
}