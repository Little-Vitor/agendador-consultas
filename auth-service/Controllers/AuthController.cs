using Auth.Api.Models;
using Auth.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UsuarioService _usuarioService;
    private readonly JwtTokenService _tokenService;

    public AuthController(UsuarioService usuarioService, JwtTokenService tokenService)
    {
        _usuarioService = usuarioService;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var usuario = await _usuarioService.BuscarPorEmailAsync(request.Email);
        if (usuario is null || !_usuarioService.ValidarSenha(usuario, request.Senha))
        {
            return Unauthorized(new { mensagem = "Email ou senha inválidos." });
        }

        var (token, expiraEm) = _tokenService.GerarToken(usuario);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiraEm = expiraEm,
            Nome = usuario.Nome,
            Role = usuario.Role
        });
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult Me()
    {
        var nome = User.Identity?.Name;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        return Ok(new { nome, email, role });
    }
}
