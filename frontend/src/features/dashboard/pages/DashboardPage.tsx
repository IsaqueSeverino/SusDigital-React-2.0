import React from 'react';
import '../styles/DashboardPage.css'
import { useDashboard } from '../hooks/useDashboard';
import { useConsultas } from '@/features/consultas/hooks/useConsultas';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { DashboardStats } from '../../../components/dashboard/DashboardStats';
import { ConsultasList } from '@/components/consultas/ConsultasList';

const DashboardPage: React.FC = () => {
  const { stats, loading, error, refetch } = useDashboard();

  const { consultas, loading: loadingConsultas, error: errorConsultas, refresh } = useConsultas();

  const proximasConsultas = consultas
    .filter(c => c.status === 'AGENDADA' && new Date(c.dataHora) > new Date())
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
    .slice(0, 5); // Mostra só 5 próximas

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Erro ao carregar dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Nenhum dado disponível</h2>
          <p className="text-gray-600 mb-6">Não conseguimos carregar as informações do dashboard.</p>
          <button
            onClick={refetch}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader lastUpdate={new Date()} />
        <DashboardStats stats={stats} />

        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mt-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Próximas Consultas</h2>
          <ConsultasList
            consultas={proximasConsultas}
            loading={loadingConsultas}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
