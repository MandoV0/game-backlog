using Microsoft.EntityFrameworkCore;
using GameBacklogAPI.Model;
using GameBacklogAPI;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Game> Games { get; set; }
    public DbSet<GameImage> GameImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .HasMany(g => g.Images)
            .WithOne(i => i.Game)
            .HasForeignKey(i => i.GameId);
    }
}