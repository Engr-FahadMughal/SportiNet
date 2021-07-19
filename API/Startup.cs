using System.Linq;
using API.Errors;
using API.Extensions;
using API.Helpers;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            //moved these services to an extension custom class for clean purposes.
            //services.AddScoped<IProductRepository, ProductRepository>();
            //services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddDbContext<StoreContext>(x => 
                x.UseSqlite(_configuration.GetConnectionString("DefaultConnection")));

            // services.Configure<ApiBehaviorOptions>(options =>
            // {
            //     options.InvalidModelStateResponseFactory = actionContext =>
            //     {
            //         var errors = actionContext.ModelState
            //             .Where(e => e.Value.Errors.Count > 0)
            //             .SelectMany(x => x.Value.Errors)
            //             .Select(x => x.ErrorMessage).ToArray();
                    
            //         var errorResponse = new ApiValidationErrorResponse
            //         {
            //             Errors = errors
            //         };

            //         return new BadRequestObjectResult(errorResponse);
            //     };
            // });
            // add the custom services extension class to use services
            services.AddApplicationServices();
            services.AddSwaggerDocumentation();
            // services.AddSwaggerGen(c => 
            // {
            //     c.SwaggerDoc("v1", new OpenApiInfo {Title = "SportiNet API", Version = "v1"});
            // });
            services.AddCors(option =>
            {
                option.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // if (env.IsDevelopment())
            // {
            //     app.UseDeveloperExceptionPage();
            // }
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseHttpsRedirection();

            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            app.UseRouting();

            app.UseStaticFiles();
            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseSwaggerDocumentation();
            // app.UseSwagger();
            // app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "SportiNet API v1");});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
