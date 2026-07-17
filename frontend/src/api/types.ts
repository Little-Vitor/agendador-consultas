export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
}

export interface Medico {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
}

export type StatusConsulta = "Agendada" | "Cancelada" | "Concluida";

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  status: StatusConsulta;
}
