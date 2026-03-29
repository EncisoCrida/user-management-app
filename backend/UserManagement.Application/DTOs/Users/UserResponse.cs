namespace UserManagement.Application.DTOs.Users;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Role { get; set; }
    public bool IsActive { get; set; }
}