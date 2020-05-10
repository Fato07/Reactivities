using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profile>>
        {
            //UserName to get followings/ followers for
            public string Username { get; set; }
            
            //The Predicate would be Passed as part of a query string in the HTTP Request
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly AppDbContext _context;
            private readonly IProfileReader _profileReader;

            public Handler(AppDbContext context, IProfileReader profileReader)
            {
                _context = context;
                _profileReader = profileReader;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Followings.AsQueryable();
                
                var userFollowings = new List<UserFollowing>();
                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                    {
                        //gets a list of users the current user is following
                        userFollowings = await queryable.Where(x => x.Target.UserName == request.Username).ToListAsync();

                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                        }

                        break;
                    }
                    case "following":
                    {
                        //gets a list the current user followers
                        userFollowings = await queryable.Where(x => x.Observer.UserName == request.Username).ToListAsync();

                        foreach (var follower in userFollowings)
                        {
                            profiles.Add(await _profileReader.ReadProfile(follower.Target.UserName));
                        }

                        break;
                    }
                }
                return profiles;
            }
        }
    }
}