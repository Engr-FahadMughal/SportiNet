using System;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;

        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;   
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            try
            {
                var basket = await _basketRepository.GetBasketAsync(id);
                return Ok(basket ?? new CustomerBasket(id));
            }
            catch(Exception ex) 
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            try
            {
                var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);

                return Ok(updatedBasket);
            }
            catch(Exception ex) 
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpDelete]
        public async Task DeleteBasket(string id)
        {
            try
            {
                await _basketRepository.DeleteBasketAsync(id);
                // return Ok(result);
                
            }
            catch(Exception ex) 
            {
                throw new Exception(ex.Message);
            }
        }
    }
}