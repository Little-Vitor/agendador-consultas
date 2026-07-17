using Auth.Api.Data;
using Auth.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.Api.Services;

public class UsuarioService
{
    private readonly AuthDbContext _context;
    private readonly PasswordHasher<Usuario> _hasher = new();

    public UsuarioService(AuthDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> BuscarPorEmailAsync(string email) =>
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public bool ValidarSenha(Usuario usuario, string senha) =>
        _hasher.VerifyHashedPassword(usuario, usuario.SenhaHash, senha) == PasswordVerificationResult.Success;
}
