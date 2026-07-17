using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scheduler.Api.Data;
using Scheduler.Api.Models;

namespace Scheduler.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/pacientes")]
public class PacientesController : ControllerBase
{
    private readonly SchedulerDbContext _context;

    public PacientesController(SchedulerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Paciente>>> GetAll() =>
        Ok(await _context.Pacientes.AsNoTracking().ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Paciente>> GetById(Guid id)
    {
        var paciente = await _context.Pacientes.FindAsync(id);
        return paciente is null ? NotFound() : Ok(paciente);
    }

    [HttpPost]
    public async Task<ActionResult<Paciente>> Create(Paciente paciente)
    {
        paciente.Id = Guid.NewGuid();
        _context.Pacientes.Add(paciente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = paciente.Id }, paciente);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Paciente paciente)
    {
        var existente = await _context.Pacientes.FindAsync(id);
        if (existente is null) return NotFound();

        existente.Nome = paciente.Nome;
        existente.DataNascimento = paciente.DataNascimento;
        existente.Telefone = paciente.Telefone;
        existente.Email = paciente.Email;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existente = await _context.Pacientes.FindAsync(id);
        if (existente is null) return NotFound();

        _context.Pacientes.Remove(existente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
