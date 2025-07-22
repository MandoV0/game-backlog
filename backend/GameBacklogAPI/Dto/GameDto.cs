namespace GameBacklogAPI.Dto
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Double AverageRating { get; set; }

        public DateTime ReleaseDate { get; set; }

        public string Developer { get; set; }
        public List<string> Genres { get; set; }
        public List<ImageDto> Images { get; set; }

    }
}