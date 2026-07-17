using System.ComponentModel.DataAnnotations;

namespace Scheduler.Api.Models;

public class Paciente
{
    public Guid Id { get; set; }

    [Required, MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public DateOnly DataNascimento { get; set; }

    [Required, MaxLength(20)]
    public string Telefone { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
}
