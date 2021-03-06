using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var username = GetUsername();
            command.Username = username;

            //save comment to DB
            var comment = await _mediator.Send(command);
            
            //Then send comment to all the clients connected to the chatHub
            await Clients.Group(command.ActivityId.ToString()).SendAsync("RecieveComment", comment);
        }

        public async Task AddToGroup(string groupName)
        {
            var username = GetUsername();
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
        }
        
        public async Task RemoveFromGroup(string groupName)
        {
            var username = GetUsername();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
        }

        private string GetUsername()
        {
            var username = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return username;
        }
    }
}