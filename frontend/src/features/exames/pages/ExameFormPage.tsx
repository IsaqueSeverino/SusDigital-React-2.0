import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExames } from '../hooks/useExames';
import { CreateExameData } from '@/types/exame.types';

const exameSchema = z.object({
  nome: z.string().min(3, 'Nome do exame deve ter no mínimo 3 caracteres'),
  tipo: z.enum(['LABORATORIAL', 'IMAGEM', 'CARDIOLOGICO', 'NEUROLOGICO'] as const, {
    errorMap: () => ({ message: 'Selecione um tipo de exame válido' }),
  }),
  dataExame: z.string().min(1, 'Data do exame é obrigatória'),
  observacoes: z.string().optional(),
});

type ExameFormData = z.infer<typeof exameSchema>;

const ExameFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultaId = searchParams.get('consultaId');
  const { create } = useExames();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExameFormData>({
    resolver: zodResolver(exameSchema),
    defaultValues: {
      tipo: 'LABORATORIAL',
      dataExame: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: ExameFormData) => {
    if (!consultaId) {
      setGeneralError("ID da consulta não fornecido. Não é possível vincular o exame.");
      return;
    }

    try {
      setIsLoading(true);
      setGeneralError(null);
      await create({
        ...data,
        consultaId,
      } as CreateExameData);
      navigate('/consultas');
    } catch (err) {
      console.error('Erro ao salvar exame:', err);
      setGeneralError("Ocorreu um erro ao salvar o exame. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!consultaId) {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Cadastrar Novo Exame</h1>

      {generalError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
          <p className="text-red-600 text-sm">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-xl" style={{ marginTop: '1rem' }}>
        <div className="mb-6 flex flex-col form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-2">Nome do Exame *</label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: Hemograma Completo"
            {...register('nome')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 ${errors.nome ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.nome && <span className="text-red-500 text-sm mt-1 field-error">{errors.nome.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="tipo" className="text-sm font-medium text-gray-700 mb-2">Tipo de Exame *</label>
          <select
            id="tipo"
            {...register('tipo')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 ${errors.tipo ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          >
            <option value="LABORATORIAL">Laboratorial</option>
            <option value="IMAGEM">Imagem</option>
            <option value="CARDIOLOGICO">Cardiológico</option>
            <option value="NEUROLOGICO">Neurológico</option>
          </select>
          {errors.tipo && <span className="text-red-500 text-sm mt-1 field-error">{errors.tipo.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="dataExame" className="text-sm font-medium text-gray-700 mb-2">Data do Exame *</label>
          <input
            id="dataExame"
            type="date"
            {...register('dataExame')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 ${errors.dataExame ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.dataExame && <span className="text-red-500 text-sm mt-1 field-error">{errors.dataExame.message}</span>}
        </div>

        <div className="mb-6 flex flex-col form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="observacoes" className="text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            id="observacoes"
            placeholder="Observações adicionais..."
            {...register('observacoes')}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 placeholder-gray-400 min-h-[120px] resize-y ${errors.observacoes ? 'border-red-500 focus:ring-red-100 focus:border-red-500 input-error' : 'border-gray-300'}`}
          />
          {errors.observacoes && <span className="text-red-500 text-sm mt-1 field-error">{errors.observacoes.message}</span>}
        </div>

        <div className="flex gap-4 justify-end mt-8 form-actions" style={{ marginTop: '1rem' }}>
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
            {isSubmitting || isLoading ? 'Salvando...' : 'Salvar Exame'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExameFormPage;
