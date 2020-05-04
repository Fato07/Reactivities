using System.Threading.Tasks;
using Application.Photos;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{userName}")]
        [AllowAnonymous]
        public async Task<ActionResult<Profile>> Get(string userName)
        {
            return await Mediator.Send(new Details.Query{ UserName = userName});
        }
    }
}