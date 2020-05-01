using Domain.Identity;

namespace Application.Interfaces
{
    public interface IJWTGenerator
    {
        string GenerateToken(AppUser user);
    }
}