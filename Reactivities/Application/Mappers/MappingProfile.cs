using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDTO>();
            CreateMap<UserActivity, AttendeeDTO>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).ImageUrl))
                .ForMember(d => d.Following, o => o.MapFrom(s=> s.AppUser.Followings.Any(x => x.TargetId == s.AppUserId)));
                //.ForMember(d => d.IsHost, o => o.Ignore());


            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.ImageUrl, o => o.MapFrom(s => 
                    s.Author.Photos.FirstOrDefault(x=> x.IsMain).ImageUrl));
        }
    }
}