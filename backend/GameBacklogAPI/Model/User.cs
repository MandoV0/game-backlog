namespace GameBacklogAPI.Model
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password_Hash { get; set; }
        public required string Email { get; set; }
    }
}