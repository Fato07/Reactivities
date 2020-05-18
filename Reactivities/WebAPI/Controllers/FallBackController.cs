using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FallBackController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return View();
        }
    }
}