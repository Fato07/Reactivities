using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Comments
{
    public class Create
    {
        public class Command: IRequest<CommentDTO>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, CommentDTO>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;

            public Handler(AppDbContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public  async Task<CommentDTO> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new{Activity = "Activity Not Found"});
                
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                
                activity.Comments.Add(comment);
                
                
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return _mapper.Map<CommentDTO>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}