namespace GameBacklogAPI.Model
{
    public class Game
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public string? Platform { get; set; }
        public DateTime ReleaseDate { get; set; }

        public int DeveloperId { get; set; }
        public Developer Developer { get; set; }

        public List<GameImage>? Images { get; set; }
        public List<Genre>? Genres { get; set; }
        public List<Rating>? Ratings { get; set; }

        public Double AverageRating { get; set; }
    }
}