using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserManagement.Infrastructure.Data;
using UserManagement.Domain.Entities;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using UserManagement.Application.DTOs.Auth;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace UserManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (model.Password.Length < 8 ||
    !Regex.IsMatch(model.Password, "[A-Z]") ||
    !Regex.IsMatch(model.Password, "[a-z]") ||
    !Regex.IsMatch(model.Password, "[0-9]") ||
    !Regex.IsMatch(model.Password, "[^a-zA-Z0-9]"))
        {
            return BadRequest(new
            {
                message = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            });
        }
        if (await _context.Users.AnyAsync(x => x.Email == model.Email))
            return Conflict(new { message = "El email ya está registrado" });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = model.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            Name = model.Name,
            Role = "user",
            IsActive = true 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Name,
            user.Role,
            user.IsActive
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == model.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            return Unauthorized(new { message = "Credenciales inválidas" });

        if (!user.IsActive)
            return Unauthorized(new { message = "Usuario inactivo, contacte al administrador" });

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_config["Jwt:ExpireMinutes"])
            ),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new
        {
            accessToken = tokenHandler.WriteToken(token),
            user = new
            {
                user.Id,
                user.Email,
                user.Role,
                user.IsActive
            }
        });
    }
}