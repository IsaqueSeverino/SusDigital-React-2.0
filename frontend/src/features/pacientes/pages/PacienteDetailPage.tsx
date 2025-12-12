import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Activity,
  CreditCard 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { pacientesService } from '../../../services/endpoints/pacientes.service';
import { Paciente } from '@/types/paciente.types';
import '../styles/PacienteDetailPage.css';

const PacienteDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = React.useState<Paciente | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    const loadPaciente = async () => {
      try {
        setLoading(true);
        const data = await pacientesService.getById(id);
        setPaciente(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar paciente';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();
  }, [id]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data Inválida';
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 max-w-md w-full">
          <h3 className="text-red-700 font-bold mb-2">Erro</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate('/pacientes')}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Paciente não encontrado</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate('/pacientes')}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {paciente.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{paciente.nome}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={16} />
                    {formatDate(paciente.dataNascimento)}
                  </span>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <CreditCard size={16} />
                    CPF: {paciente.cpf}
                  </span>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <Activity size={16} />
                    SUS: {paciente.cartaoSus || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm gap-2"
            >
              <Edit size={16} />
              Editar Dados
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Informações de Contato</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-gray-900 mt-1">{paciente.telefone || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900 mt-1">{paciente.email || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Endereço</p>
                    <p className="text-gray-900 mt-1">{paciente.endereco || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-blue-900 font-semibold mb-2">Ações Rápidas</h3>
              <div className="space-y-3">
                <button 
                    onClick={() => navigate('/consultas/agendar')}
                    className="w-full text-left px-4 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200 flex items-center gap-2"
                >
                    <Calendar size={18} />
                    Agendar Nova Consulta
                </button>
                <button className="w-full text-left px-4 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200 flex items-center gap-2">
                    <FileText size={18} />
                    Gerar Relatório
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="text-gray-400" size={20}/>
                    Histórico de Consultas
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver tudo</button>
              </div>
              <div className="p-6">
                 <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>Nenhuma consulta recente encontrada para este paciente.</p>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="text-gray-400" size={20}/>
                    Prontuários e Anotações
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver tudo</button>
              </div>
              <div className="p-6">
                 <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>Nenhum registro de prontuário encontrado.</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PacienteDetailPage;