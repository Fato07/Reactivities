using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly AppDbContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(AppDbContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //Current User Logged in
                var observer = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUserName());
                
                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if(target == null)
                    throw new RestException(HttpStatusCode.NotFound, new {User = "User Not Found"});

                //check if there is an existing Following
                var following =
                   await  _context.Followings.SingleOrDefaultAsync(
                        x => x.ObserverId == observer.Id && x.TargetId == target.Id);
                
                if(following != null)
                    throw new RestException(HttpStatusCode.BadRequest, new {User = "You are already Following this User"});

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.Followings.Add(following);
                }
                
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}