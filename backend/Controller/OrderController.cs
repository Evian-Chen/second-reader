using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderReporitory _orderRepo;
        public OrderController(IOrderReporitory orderRepo)
        {
            _orderRepo = orderRepo;
        }

        [HttpPost("{id:int}")]
        [Authorize]
        public Task<IActionResult> CreateOrderByCartId([FromRoute] int id)
        {
            throw new NotImplementedException();
        }
    }
}