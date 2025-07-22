namespace GameBacklogAPI.Model
{
    public class Developer
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public List<Game>? Games { get; set; }
    }
}