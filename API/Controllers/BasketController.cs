using System;
using System.Threading.Tasks;
using API.DTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _basketRepository = basketRepository;   
            _mapper = mapper;
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
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
            try
            {
                var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);
                
                var updatedBasket = await _basketRepository.UpdateBasketAsync(customerBasket);

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