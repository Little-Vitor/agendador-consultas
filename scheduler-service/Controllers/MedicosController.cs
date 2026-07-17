using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scheduler.Api.Data;
using Scheduler.Api.Models;

namespace Scheduler.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/medicos")]
public class MedicosController : ControllerBase
{
    private readonly SchedulerDbContext _context;

    public MedicosController(SchedulerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Medico>>> GetAll() =>
        Ok(await _context.Medicos.AsNoTracking().ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Medico>> GetById(Guid id)
    {
        var medico = await _context.Medicos.FindAsync(id);
        return medico is null ? NotFound() : Ok(medico);
    }

    [HttpPost]
    public async Task<ActionResult<Medico>> Create(Medico medico)
    {
        medico.Id = Guid.NewGuid();
        _context.Medicos.Add(medico);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = medico.Id }, medico);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Medico medico)
    {
        var existente = await _context.Medicos.FindAsync(id);
        if (existente is null) return NotFound();

        existente.Nome = medico.Nome;
        existente.Especialidade = medico.Especialidade;
        existente.Crm = medico.Crm;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existente = await _context.Medicos.FindAsync(id);
        if (existente is null) return NotFound();

        _context.Medicos.Remove(existente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
