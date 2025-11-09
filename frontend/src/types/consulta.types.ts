export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: Date;
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
  descricao?: string;
  receita?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateConsultaData {
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  descricao?: string;
}

export interface UpdateConsultaData extends Partial<CreateConsultaData> {
  status?: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
}
