import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProntuarios } from '../hooks/useProntuarios';
import { CreateProntuarioData } from '@/types/prontuario.types';

const prontuarioSchema = z.object({
  diagnostico: z.string().min(3, 'Diagnóstico é obrigatório e deve ter no mínimo 3 caracteres'),
  sintomas: z.string().optional(),
  tratamento: z.string().optional(),
  observacoes: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
});

type ProntuarioFormData = z.infer<typeof prontuarioSchema>;

const ProntuarioFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get('pacienteId');
  const { create } = useProntuarios();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProntuarioFormData>({
    resolver: zodResolver(prontuarioSchema),
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: ProntuarioFormData) => {
    if (!pacienteId) {
      setGeneralError("ID do paciente não fornecido. Não é possível criar o prontuário.");
      return;
    }

    try {
      setIsLoading(true);
      setGeneralError(null);
      await create({
        ...data,
        pacienteId,
      } as CreateProntuarioData);
      navigate('/consultas'); 
    } catch (err) {
      console.error('Erro ao salvar prontuário:', err);
      setGeneralError("Ocorreu um erro ao salvar o prontuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!pacienteId) {
    return (
        <div className="w-full px-6 py-8 max-w-4xl mx-auto">
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
                <p className="text-red-700 font-medium">Erro de Navegação</p>
                <p className="text-red-600 text-sm mt-1">
                    Esta página deve ser acessada a partir de uma consulta. Volte para a lista de consultas e tente novamente.
                </p>
                <button 
                   onClick={() => navigate('/consultas')}
                   className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                    Voltar para Consultas
                </button>
            </div>
        </div>
    )
 }

  return (
    <div className="w-full px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Cadastrar Prontuário</h1>

      {generalError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
          <p className="text-red-600 text-sm">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-xl" style={{ marginTop: '1rem'}}>
        <div className="mb-6 flex flex-col form-group">
          <label htmlFor="data" className="text-sm font-medium text-gray-700 mb-2">Data *</label>
          <input
            id="data"
            type="date"
            {...register('data')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 ${errors.data ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.data && <span className="text-red-500 text-sm mt-1 field-error">{errors.data.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginTop: '1rem'}}>
          <label htmlFor="diagnostico" className="text-sm font-medium text-gray-700 mb-2">Diagnóstico *</label>
          <input
            id="diagnostico"
            type="text"
            placeholder="Diagnóstico principal"
            {...register('diagnostico')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.diagnostico ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.diagnostico && <span className="text-red-500 text-sm mt-1 field-error">{errors.diagnostico.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginTop: '1rem'}}>
          <label htmlFor="sintomas" className="text-sm font-medium text-gray-700 mb-2">Sintomas</label>
          <textarea
            id="sintomas"
            placeholder="Relato dos sintomas..."
            {...register('sintomas')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 min-h-[100px] resize-y ${errors.sintomas ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.sintomas && <span className="text-red-500 text-sm mt-1 field-error">{errors.sintomas.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginTop: '1rem'}}>
          <label htmlFor="tratamento" className="text-sm font-medium text-gray-700 mb-2">Tratamento</label>
          <textarea
            id="tratamento"
            placeholder="Plano de tratamento..."
            {...register('tratamento')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 min-h-[100px] resize-y ${errors.tratamento ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.tratamento && <span className="text-red-500 text-sm mt-1 field-error">{errors.tratamento.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginTop: '1rem'}}>
          <label htmlFor="observacoes" className="text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            id="observacoes"
            placeholder="Observações adicionais..."
            {...register('observacoes')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 min-h-[100px] resize-y ${errors.observacoes ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.observacoes && <span className="text-red-500 text-sm mt-1 field-error">{errors.observacoes.message}</span>}
        </div>

        <div className="flex gap-4 justify-end mt-8 form-actions" style={{ marginTop: '1rem'}}>
          <button
            type="button"
            onClick={() => navigate('/consultas')}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-transparent btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed btn btn-primary"
          >
            {isSubmitting || isLoading ? 'Salvando...' : 'Salvar Prontuário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProntuarioFormPage;
