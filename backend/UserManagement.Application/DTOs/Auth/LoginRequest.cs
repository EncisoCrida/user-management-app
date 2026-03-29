using System.ComponentModel.DataAnnotations;

namespace UserManagement.Application.DTOs.Auth;

public class LoginRequest
{
    [Required(ErrorMessage = "El email es obligatorio")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    public string Password { get; set; }
}