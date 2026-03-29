using System.ComponentModel.DataAnnotations;

namespace UserManagement.Application.DTOs.Users;

public class UpdateUserRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MinLength(3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
    public string Name { get; set; }

    public string? Role { get; set; }

    public bool? IsActive { get; set; }
    public string? Password { get; set; }
}