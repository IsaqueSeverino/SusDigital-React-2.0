export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  cartaoSus?: string;
  dataNascimento: Date;
  telefone?: string;
  endereco?: string;
  email?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreatePacienteData {
  nome: string;
  cpf: string;
  cartaoSus?: string;
  dataNascimento: string;
  telefone?: string;
  endereco?: string;
  email?: string;
}

export interface UpdatePacienteData extends Partial<CreatePacienteData> {}
