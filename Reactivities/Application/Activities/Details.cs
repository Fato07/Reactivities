using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDTO>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDTO>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;

            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ActivityDTO> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw new Exception("Computer Says No");
                
                
                var activity = await _context.Activities.FindAsync( request.ActivityId);
                
                if (activity == null)
                    throw  new RestException(HttpStatusCode.NotFound, new{activity = "not found"});

                var activityToReturn = _mapper.Map<Activity, ActivityDTO>(activity);
                return activityToReturn;
            }
        }
    }
}