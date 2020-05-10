using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Mappers
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDTO, bool>
    {
        private readonly AppDbContext _context;
        private readonly IUserAccessor _userAccessor;
        public FollowingResolver(AppDbContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public bool Resolve(UserActivity source, AttendeeDTO destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName()).Result;

            if (currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
                return true;

            return false;
        }
    }
}