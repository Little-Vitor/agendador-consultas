using System.ComponentModel.DataAnnotations;

namespace Scheduler.Api.Models;

public class Medico
{
    public Guid Id { get; set; }

    [Required, MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Especialidade { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Crm { get; set; } = string.Empty;
}
