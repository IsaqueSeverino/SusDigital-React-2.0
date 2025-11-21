import { api } from '../../services/api'; 
import { ConsultasListResponse } from '../../types/consulta.types';

export interface DashboardStats {
  pacientes: number;
  medicos: number;
  consultas: number;
  prontuarios: number;
}

class DashboardService {

  async getPacientesTotal(): Promise<number> {
    try {
      const response = await api.get<{ length?: number; pagination?: { total: number } } | any[]>('/pacientes');
      
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      
      return response.data?.pagination?.total || 0;
    } catch (error) {
      console.error('Erro ao buscar total de pacientes:', error);
      return 0;
    }
  }

  async getMedicosTotal(): Promise<number> {
    try {
      const response = await api.get<{ length?: number; pagination?: { total: number } } | any[]>('/medicos');
      
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      
      return response.data?.pagination?.total || 0;
    } catch (error) {
      console.error('Erro ao buscar total de médicos:', error);
      return 0;
    }
  }

  async getConsultasTotal(): Promise<number> {
    try {
      const response = await api.get<ConsultasListResponse>('/consultas');
      
      return response.data?.pagination?.total || response.data?.consultas?.length || 0;
    } catch (error) {
      console.error('Erro ao buscar total de consultas:', error);
      return 0;
    }
  }

  async getProntuariosTotal(): Promise<number> {
    try {
      const response = await api.get<{ length?: number; pagination?: { total: number } } | any[]>('/prontuarios');
      
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      
      return response.data?.pagination?.total || 0;
    } catch (error) {
      console.error('Erro ao buscar total de prontuários:', error);
      return 0;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [pacientes, medicos, consultas, prontuarios] = await Promise.all([
        this.getPacientesTotal(),
        this.getMedicosTotal(),
        this.getConsultasTotal(),
        this.getProntuariosTotal(),
      ]);

      return { pacientes, medicos, consultas, prontuarios };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  }
}

export default new DashboardService();
