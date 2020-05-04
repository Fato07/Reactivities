using Domain;
using Domain.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public DbSet<Activity> Activities { get; set; } = default!;
        public DbSet<UserActivity> UserActivities { get; set; } = default!;
        public DbSet<Photo> Photos { get; set; } =  default!;
        //public DbSet<Comment> Comments { get; set; } =  default!;
        //public DbSet<UserFollowing> Followings { get; set; } = default!;
        
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserActivity>(x 
                => x.HasKey(ua => new {ua.AppUserId, ua.ActivityId}));

            builder.Entity<UserActivity>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);
            
            builder.Entity<UserActivity>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(a => a.ActivityId);

        }
    }
}