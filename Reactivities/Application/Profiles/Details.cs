using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly AppDbContext _context;
            private readonly IUserAccessor _userAccessor;
          
            public Handler(AppDbContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

                var profile = new Profile();

                profile.DisplayName = user.DisplayName;
                profile.Username = user.UserName;
                profile.Image = user.Photos.FirstOrDefault(x => x.IsMain)?.ImageUrl;
                profile.Photos = user.Photos;
                profile.Bio = user.Bio;

                return profile;
            }
        }
    }
}