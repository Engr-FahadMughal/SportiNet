using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find();

            if (thing == null)
            {
                return NotFound(new ApiResponse(404));  
            }
            return Ok();
        }

        [HttpGet]
        public ActionResult GetServerError()
        {
            var thing = _context.Products.Find();

            var thindToReturn = thing.ToString();

            return Ok();
        }

        [HttpGet]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }

        [HttpGet]
        public ActionResult BadRequest(int id)
        {            
            return Ok();
        }
    }
}