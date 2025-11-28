export type ExameTipo = 'LABORATORIAL' | 'IMAGEM' | 'CARDIOLOGICO' | 'NEUROLOGICO';

export interface Exame {
  id: string;
  consultaId: string;
  tipo: ExameTipo;
  nome: string;
  dataExame: string; 
  resultado?: string;
  observacoes?: string;

  consulta?: {
    id: string;
    dataHora: string;
    medicoId: string;
    medico?: {
      nome: string,
    }
    pacienteId: string;
  };
}

export type ExamesListResponse = Exame[];

export interface CreateExameData {
  consultaId: string;
  tipo: ExameTipo;
  nome: string;
  dataExame: string; 
  resultado?: string;
  observacoes?: string;
}

export interface UpdateExameData {
  resultado?: string;
  observacoes?: string;
}

