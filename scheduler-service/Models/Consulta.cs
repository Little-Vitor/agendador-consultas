using System.ComponentModel.DataAnnotations;

namespace Scheduler.Api.Models;

public enum StatusConsulta
{
    Agendada,
    Cancelada,
    Concluida
}

public class Consulta
{
    public Guid Id { get; set; }

    [Required]
    public Guid PacienteId { get; set; }

    [Required]
    public Guid MedicoId { get; set; }

    [Required]
    public DateTime DataHora { get; set; }

    public StatusConsulta Status { get; set; } = StatusConsulta.Agendada;
}
