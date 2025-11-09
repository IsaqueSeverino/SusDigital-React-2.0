import { useState, useEffect } from 'react';
import { consultasService } from '../../../services/endpoints/consultas.service';
import { Consulta, CreateConsultaData, UpdateConsultaData } from '@/types/consulta.types';

interface UseConsultasReturn {
  consultas: Consulta[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: CreateConsultaData) => Promise<void>;
  update: (id: string, data: UpdateConsultaData) => Promise<void>;
  getByPaciente: (pacienteId: string) => Promise<Consulta[]>;
}

export const useConsultas = (): UseConsultasReturn => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultasService.getAll();
      setConsultas(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar consultas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadConsultas();
  };

  const create = async (data: CreateConsultaData) => {
    await consultasService.create(data);
    await loadConsultas();
  };

  const update = async (id: string, data: UpdateConsultaData) => {
    await consultasService.update(id, data);
    await loadConsultas();
  };

  const getByPaciente = async (pacienteId: string): Promise<Consulta[]> => {
    return await consultasService.getByPaciente(pacienteId);
  };

  return {
    consultas,
    loading,
    error,
    refresh,
    create,
    update,
    getByPaciente,
  };
};
