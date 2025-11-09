export interface Medico {
  id: string;
  nome: string;
  email: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  endereco?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateMedicoData {
  nome: string;
  email: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  endereco?: string;
}
