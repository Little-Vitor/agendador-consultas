import { useEffect, useState, type FormEvent } from "react";
import { schedulerApi } from "../api/client";
import type { Medico } from "../api/types";

const VAZIO = { nome: "", especialidade: "", crm: "" };

export function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    try {
      setMedicos(await schedulerApi.get<Medico[]>("/api/medicos"));
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar médicos.");
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
        await schedulerApi.put(`/api/medicos/${editandoId}`, form);
      } else {
        await schedulerApi.post("/api/medicos", form);
      }
      setForm(VAZIO);
      setEditandoId(null);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar médico.");
    }
  }

  function editar(medico: Medico) {
    setEditandoId(medico.id);
    setForm({ nome: medico.nome, especialidade: medico.especialidade, crm: medico.crm });
  }

  async function excluir(id: string) {
    setErro(null);
    try {
      await schedulerApi.delete(`/api/medicos/${id}`);
      await carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir médico.");
    }
  }

  return (
    <div className="crud-page">
      <h2>Médicos</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          placeholder="Especialidade"
          value={form.especialidade}
          onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
          required
        />
        <input
          placeholder="CRM"
          value={form.crm}
          onChange={(e) => setForm({ ...form, crm: e.target.value })}
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
            <th>Especialidade</th>
            <th>CRM</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((medico) => (
            <tr key={medico.id}>
              <td>{medico.nome}</td>
              <td>{medico.especialidade}</td>
              <td>{medico.crm}</td>
              <td>
                <button onClick={() => editar(medico)}>Editar</button>
                <button onClick={() => excluir(medico.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
