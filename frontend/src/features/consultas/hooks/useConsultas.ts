import { useState, useEffect } from 'react';
import { consultasService } from '../../../services/endpoints/consultas.service';
import { Consulta, ConsultasListResponse, CreateConsultaData, UpdateConsultaData } from '@/types/consulta.types';
interface UseConsultasReturn {
  consultas: Consulta[];
  loading: boolean;
  error: string | null;
  pagination: ConsultasListResponse['pagination'] | null;
  refresh: () => Promise<void>;
  create: (data: CreateConsultaData) => Promise<void>;
  update: (id: string, data: UpdateConsultaData) => Promise<void>;
  getByPaciente: (pacienteId: string, params?: { page?: number; limit?: number }) => Promise<Consulta[]>;
}


export const useConsultas = (): UseConsultasReturn => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pagination, setPagination] = useState<ConsultasListResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadConsultas = async (params = { page: 1, limit: 100 }) => {
    try {
      setLoading(true);
      setError(null);
      const data: ConsultasListResponse = await consultasService.getAll(params);
      setConsultas(data.consultas ?? []);
      setPagination(data.pagination ?? null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar consultas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultas({ page: 1, limit: 100 });
  }, []);

  const refresh = async () => {
    await loadConsultas({ page: 1, limit: 100 });
  };

  const create = async (data: CreateConsultaData) => {
    await consultasService.create(data);
    await loadConsultas({ page: 1, limit: 100 });
  };

  const update = async (id: string, data: UpdateConsultaData) => {
    await consultasService.update(id, data);
    await loadConsultas({ page: 1, limit: 100 });
  };

  const getByPaciente = async (
    pacienteId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<Consulta[]> => {
    const data = await consultasService.getByPaciente(pacienteId, params);
    return data.consultas ?? [];
  };

  return {
    consultas,
    loading,
    error,
    pagination,
    refresh,
    create,
    update,
    getByPaciente,
  };
};
