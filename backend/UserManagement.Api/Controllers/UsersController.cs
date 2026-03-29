using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UserManagement.Application.DTOs.Users;
using UserManagement.Application.Interfaces;
using UserManagement.Application.Common;

namespace UserManagement.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(string? search = "", int page = 1, int size = 10)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "admin")
        {
            var users = await _service.GetUsers(search ?? "", page, size);
            return Ok(ApiResponse<List<UserResponse>>.Ok(users));
        }

        var user = await _service.GetUser(
            Guid.Parse(userId!),
            userId!,
            role!
        );

        return Ok(ApiResponse<List<UserResponse>>.Ok(
            new List<UserResponse> { user! }
        ));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var user = await _service.GetUser(id, userId!, role!);

        if (user == null)
            return Forbid();

        return Ok(ApiResponse<UserResponse>.Ok(user));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            var user = await _service.CreateUser(request);
            return Ok(ApiResponse<UserResponse>.Ok(user, "Usuario creado"));
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("Email"))
            {
                return Conflict(new { message = ex.Message });
            }

            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest updated)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var user = await _service.UpdateUser(id, updated, userId!, role!);

        return Ok(ApiResponse<UserResponse>.Ok(user, "Usuario actualizado"));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _service.DeleteUser(id);

        if (!result)
            return NotFound();

        return Ok(ApiResponse<string>.Ok("Eliminado"));
    }
}