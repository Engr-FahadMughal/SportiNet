using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "fMboys",
                    Email = "fmboys@email.com",
                    UserName = "fmboys@email.com",
                    Address = new Address
                    {
                        FirstName = "fMboys",
                        LastName = "fmboys99",
                        Street = "Mughal street",
                        City = "Sankhatra",
                        State = "PB",
                        ZipCode = "56000"
                    }
                };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            }
            
        }
    }
}