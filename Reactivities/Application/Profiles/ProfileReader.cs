using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly AppDbContext _context;
        private readonly IUserAccessor _userAccessor;

        public ProfileReader(AppDbContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        //This method Would be added as a service and injected into Ptofile API endpoints on each user Profile
        public async Task<Profile> ReadProfile(string username)
        {
            //Check if user passed into the method exists
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);
            
            if(user == null)
                throw new RestException(HttpStatusCode.NotFound, new {User = "User Not Found"});
            
            //Check if user is Currently logged in user
            var currentUser = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUserName());

            //Profile to be returned
            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.ImageUrl,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowersCount = user.Followers.Count,
                FollowingCount = user.Followings.Count
                
            };
            
            //check if the currently logged in User is following the Profile of the user to be returned
            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
                profile.IsFollowing = true;

            return profile;
        }
    }
}