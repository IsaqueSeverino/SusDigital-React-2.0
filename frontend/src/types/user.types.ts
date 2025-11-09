export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  dataNascimento?: Date;
  telefone?: string;
  endereco?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
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
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  statusCode: number;
}
