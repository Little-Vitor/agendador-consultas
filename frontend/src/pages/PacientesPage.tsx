import { useEffect, useState, type FormEvent } from "react";
import { schedulerApi } from "../api/client";
import type { Paciente } from "../api/types";

const VAZIO = { nome: "", dataNascimento: "", telefone: "", email: "" };

export function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      setPacientes(await schedulerApi.get<Paciente[]>("/api/pacientes"));
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar pacientes.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    try {
      if (editandoId) {
        await schedulerApi.put(`/api/pacientes/${editandoId}`, form);
      } else {
        await schedulerApi.post("/api/pacientes", form);
      }
      setForm(VAZIO);
      setEditandoId(null);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar paciente.");
    }
  }

  function editar(paciente: Paciente) {
    setEditandoId(paciente.id);
    setForm({
      nome: paciente.nome,
      dataNascimento: paciente.dataNascimento,
      telefone: paciente.telefone,
      email: paciente.email,
    });
  }

  async function excluir(id: string) {
    setErro(null);
    try {
      await schedulerApi.delete(`/api/pacientes/${id}`);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir paciente.");
    }
  }

  return (
    <div className="crud-page">
      <h2>Pacientes</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.dataNascimento}
          onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
          required
        />
        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">{editandoId ? "Salvar" : "Adicionar"}</button>
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
            <th>Nome</th>
            <th>Nascimento</th>
            <th>Telefone</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.nome}</td>
              <td>{paciente.dataNascimento}</td>
              <td>{paciente.telefone}</td>
              <td>{paciente.email}</td>
              <td>
                <button onClick={() => editar(paciente)}>Editar</button>
                <button onClick={() => excluir(paciente.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
