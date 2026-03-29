using System.ComponentModel.DataAnnotations;

namespace UserManagement.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "Mínimo 6 caracteres")]
    public string Password { get; set; }

    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Name { get; set; }
}