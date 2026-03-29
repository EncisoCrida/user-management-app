using UserManagement.Domain.Entities;
using BCrypt.Net;

namespace UserManagement.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Users.Any())
            return; // ya hay datos

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@demo.com",
            Name = "Administrador",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "admin",
            IsActive = true
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@demo.com",
            Name = "Usuario",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
            Role = "user",
            IsActive = true
        };

        context.Users.AddRange(admin, user);
        await context.SaveChangesAsync();
    }
}