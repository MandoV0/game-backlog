namespace GameBacklogAPI.Dto
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Platform { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public List<string> ImageUrls { get; set;  }
    }

}