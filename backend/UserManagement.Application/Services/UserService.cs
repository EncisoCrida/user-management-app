using Microsoft.EntityFrameworkCore;
using UserManagement.Application.DTOs.Users;
using UserManagement.Application.Interfaces;
using UserManagement.Domain.Entities;
using UserManagement.Infrastructure.Data;
using BCrypt.Net;

namespace UserManagement.Application.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponse>> GetUsers(string search, int page, int size)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(x => x.Email.Contains(search) || x.Name.Contains(search));
        }

        return await query
            .Skip((page - 1) * size)
            .Take(size)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Role = u.Role,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    public async Task<UserResponse?> GetUser(Guid id, string currentUserId, string role)
    {
        if (role != "admin" && currentUserId != id.ToString())
            return null;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return null;

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponse> CreateUser(CreateUserRequest request)
    {
        if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            throw new Exception("Email ya existe");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Name = request.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponse> UpdateUser(Guid id, UpdateUserRequest updated, string currentUserId, string role)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            throw new Exception("Usuario no encontrado");

        if (role != "admin" && currentUserId != id.ToString())
            throw new UnauthorizedAccessException();

        user.Name = updated.Name;

        if (!string.IsNullOrEmpty(updated.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updated.Password);
        }

        if (role == "admin")
        {
            user.Role = updated.Role ?? user.Role;
            
            if (user.Id.ToString() != currentUserId)
            {
                if (updated.IsActive.HasValue)
                    user.IsActive = updated.IsActive.Value;
            }
        }

        await _context.SaveChangesAsync();

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            IsActive = user.IsActive
        };
    }

    public async Task<bool> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

}