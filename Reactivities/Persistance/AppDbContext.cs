using Domain;
using Domain.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class AppDbContext : DbContext
    {
        public DbSet<Activity> Activities { get; set; } = default!;
        //public DbSet<UserActivity> UserActivities { get; set; } = default!;
        //public DbSet<Photo> Photos { get; set; } =  default!;
        //public DbSet<Comment> Comments { get; set; } =  default!;
        //public DbSet<UserFollowing> Followings { get; set; } = default!;
        
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

    }
}