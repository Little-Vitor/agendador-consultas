import { useEffect, useState, type FormEvent } from "react";
import { schedulerApi } from "../api/client";
import type { Consulta, Medico, Paciente, StatusConsulta } from "../api/types";

const VAZIO = { pacienteId: "", medicoId: "", dataHora: "", status: "Agendada" as StatusConsulta };

export function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      const [c, p, m] = await Promise.all([
        schedulerApi.get<Consulta[]>("/api/consultas"),
        schedulerApi.get<Paciente[]>("/api/pacientes"),
        schedulerApi.get<Medico[]>("/api/medicos"),
      ]);
      setConsultas(c);
      setPacientes(p);
      setMedicos(m);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar consultas.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function nomePaciente(id: string) {
    return pacientes.find((p) => p.id === id)?.nome ?? "—";
  }

  function nomeMedico(id: string) {
    return medicos.find((m) => m.id === id)?.nome ?? "—";
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    try {
      if (editandoId) {
        await schedulerApi.put(`/api/consultas/${editandoId}`, form);
      } else {
        await schedulerApi.post("/api/consultas", form);
      }
      setForm(VAZIO);
      setEditandoId(null);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar consulta.");
    }
  }

  function editar(consulta: Consulta) {
    setEditandoId(consulta.id);
    setForm({
      pacienteId: consulta.pacienteId,
      medicoId: consulta.medicoId,
      dataHora: consulta.dataHora.slice(0, 16),
      status: consulta.status,
    });
  }

  async function excluir(id: string) {
    setErro(null);
    try {
      await schedulerApi.delete(`/api/consultas/${id}`);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir consulta.");
    }
  }

  return (
    <div className="crud-page">
      <h2>Consultas</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="inline-form" onSubmit={handleSubmit}>
        <select
          value={form.pacienteId}
          onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
          required
        >
          <option value="">Paciente...</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        <select value={form.medicoId} onChange={(e) => setForm({ ...form, medicoId: e.target.value })} required>
          <option value="">Médico...</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome} ({m.especialidade})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.dataHora}
          onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as StatusConsulta })}
        >
          <option value="Agendada">Agendada</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Concluida">Concluída</option>
        </select>
        <button type="submit">{editandoId ? "Salvar" : "Agendar"}</button>
        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setForm(VAZIO);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data/Hora</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => (
            <tr key={consulta.id}>
              <td>{nomePaciente(consulta.pacienteId)}</td>
              <td>{nomeMedico(consulta.medicoId)}</td>
              <td>{new Date(consulta.dataHora).toLocaleString("pt-BR")}</td>
              <td>{consulta.status}</td>
              <td>
                <button onClick={() => editar(consulta)}>Editar</button>
                <button onClick={() => excluir(consulta.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
