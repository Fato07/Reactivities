using System.Collections.Generic;
using Domain;
using Newtonsoft.Json;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }

        // "[JsonPropertyName("following")]" does not work for some Reason,
        // so i would just rename it as "Following" in client Side rather than using the naming Convention
        // "IsFollowed"
        // This property Gets the list of users a follower is following
        public bool IsFollowing { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}