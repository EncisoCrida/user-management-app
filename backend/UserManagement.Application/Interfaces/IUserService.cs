using UserManagement.Application.DTOs.Users;

namespace UserManagement.Application.Interfaces;

public interface IUserService
{
    Task<List<UserResponse>> GetUsers(string search, int page, int size);
    Task<UserResponse?> GetUser(Guid id, string currentUserId, string role);
    Task<UserResponse> CreateUser(CreateUserRequest request);
    Task<UserResponse?> UpdateUser(Guid id, UpdateUserRequest request, string currentUserId, string role);
    Task<bool> DeleteUser(Guid id);
}