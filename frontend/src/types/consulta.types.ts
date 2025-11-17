export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: string; 
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
  motivo?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  medico?: {
    nome: string;
    especialidade: string;
    crm: string;
  };
  paciente?: {
    nome: string;
    cpf: string;
    cartaoSus: string;
  };
  exames?: Array<{
    id: string;
    nome: string;
    tipo: string;
    dataExame: string;
  }>;
}

export interface ConsultasListResponse {
  consultas: Consulta[];
  pagination: {
    currentPage: number;
    pages: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateConsultaData {
  pacienteId: string;
  medicoId: string;
  dataHora: string; 
  motivo?: string;
  observacoes?: string;
}

export interface UpdateConsultaData extends Partial<CreateConsultaData> {
  status?: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
}
