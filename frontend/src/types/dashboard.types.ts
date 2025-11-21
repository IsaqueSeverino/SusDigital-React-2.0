export interface DashboardStats {
  pacientes: number;
  medicos: number;
  consultas: number;
  prontuarios: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
}

export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}
