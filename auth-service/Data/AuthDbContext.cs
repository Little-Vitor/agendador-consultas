using Auth.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.Api.Data;

public class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Nome).HasMaxLength(150).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(150).IsRequired();
            entity.Property(u => u.SenhaHash).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(50).IsRequired();
        });

        var hasher = new PasswordHasher<Usuario>();

        var admin = new Usuario
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Nome = "Administrador",
            Email = "admin@example.com",
            Role = "Admin"
        };
        admin.SenhaHash = hasher.HashPassword(admin, "Admin@123");

        var recepcionista = new Usuario
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Nome = "Recepcionista",
            Email = "recepcao@example.com",
            Role = "Recepcionista"
        };
        recepcionista.SenhaHash = hasher.HashPassword(recepcionista, "Recepcao@123");

        modelBuilder.Entity<Usuario>().HasData(admin, recepcionista);
    }
}
