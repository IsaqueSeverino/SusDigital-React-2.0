export interface Prontuario {
  id: string;
  data: string; 
  diagnostico: string;
  sintomas?: string;
  tratamento?: string;
  observacoes?: string;
  pacienteId: string;
  createdAt: string;
  updatedAt: string;

  paciente?: Paciente;
  medicacoes?: Medicacao[];
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone?: string;
  endereco?: string;
  cartaoSus?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicacao {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  instrucoes?: string;
  prontuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProntuarioData {
  diagnostico: string;
  sintomas?: string;
  tratamento?: string;
  observacoes?: string;
  pacienteId: string;
  data?: string;
}

export interface UpdateProntuarioData extends Partial<CreateProntuarioData> {}
