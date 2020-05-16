using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        // GET list of activities
        [HttpGet]
        [AllowAnonymous]
        [Produces("application/json")]
        //[Consumes("application/json")]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
        {
            //limit- how many activities to be returned
            //offSet- How many activities to be skipped
            //Upon receiving a list of activities, optional parameters are passed: 'list' and 'offset'
            //returns a list of activities based on the limit specified and how many activities would be skipped
            return await Mediator.Send(new List.Query(limit, offset, isGoing, isHost, startDate));
        }
        
        // GET single of activity by ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ActivityDTO>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query{ActivityId = id});
        }
        
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command{Id = id});
        }
        
        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command{Id = id});
        }
        
        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> UnAttend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command{Id = id});
        }
    }
}