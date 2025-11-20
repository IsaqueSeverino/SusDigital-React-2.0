export interface Usuario {
  id: string;
  email: string;
  tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  ativo: boolean;
  createdAt: string; 
  medico: MedicoProfile | null;
  paciente: PacienteProfile | null;
}

export interface MedicoProfile {
  nome: string;
  especialidade: string;
  crm: string;
}

export interface PacienteProfile {
  nome: string;
  cpf: string;
  cartaoSus: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  dataNascimento?: string; 
  telefone?: string;
  endereco?: string;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  statusCode: number;
}
