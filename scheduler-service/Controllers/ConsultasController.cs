using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scheduler.Api.Data;
using Scheduler.Api.Models;

namespace Scheduler.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/consultas")]
public class ConsultasController : ControllerBase
{
    private readonly SchedulerDbContext _context;

    public ConsultasController(SchedulerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Consulta>>> GetAll() =>
        Ok(await _context.Consultas.AsNoTracking().ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Consulta>> GetById(Guid id)
    {
        var consulta = await _context.Consultas.FindAsync(id);
        return consulta is null ? NotFound() : Ok(consulta);
    }

    [HttpPost]
    public async Task<ActionResult<Consulta>> Create(Consulta consulta)
    {
        if (!await _context.Pacientes.AnyAsync(p => p.Id == consulta.PacienteId))
            return BadRequest(new { mensagem = "Paciente não encontrado." });

        if (!await _context.Medicos.AnyAsync(m => m.Id == consulta.MedicoId))
            return BadRequest(new { mensagem = "Médico não encontrado." });

        consulta.Id = Guid.NewGuid();
        _context.Consultas.Add(consulta);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = consulta.Id }, consulta);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Consulta consulta)
    {
        var existente = await _context.Consultas.FindAsync(id);
        if (existente is null) return NotFound();

        if (!await _context.Pacientes.AnyAsync(p => p.Id == consulta.PacienteId))
            return BadRequest(new { mensagem = "Paciente não encontrado." });

        if (!await _context.Medicos.AnyAsync(m => m.Id == consulta.MedicoId))
            return BadRequest(new { mensagem = "Médico não encontrado." });

        existente.PacienteId = consulta.PacienteId;
        existente.MedicoId = consulta.MedicoId;
        existente.DataHora = consulta.DataHora;
        existente.Status = consulta.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existente = await _context.Consultas.FindAsync(id);
        if (existente is null) return NotFound();

        _context.Consultas.Remove(existente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
