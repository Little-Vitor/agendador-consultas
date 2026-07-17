using Microsoft.EntityFrameworkCore;
using Scheduler.Api.Models;

namespace Scheduler.Api.Data;

public class SchedulerDbContext : DbContext
{
    public SchedulerDbContext(DbContextOptions<SchedulerDbContext> options) : base(options)
    {
    }

    public DbSet<Paciente> Pacientes => Set<Paciente>();
    public DbSet<Medico> Medicos => Set<Medico>();
    public DbSet<Consulta> Consultas => Set<Consulta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Nome).HasMaxLength(150).IsRequired();
            entity.Property(p => p.Telefone).HasMaxLength(20).IsRequired();
            entity.Property(p => p.Email).HasMaxLength(150).IsRequired();
        });

        modelBuilder.Entity<Medico>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Nome).HasMaxLength(150).IsRequired();
            entity.Property(m => m.Especialidade).HasMaxLength(100).IsRequired();
            entity.Property(m => m.Crm).HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<Consulta>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(c => c.DataHora).HasColumnType("timestamp without time zone");
        });
    }
}
