import React from 'react';
import { ArrowLeft } from 'lucide-react';
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

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  if (!paciente) {
    return <div className="empty-state">Paciente não encontrado</div>;
  }

  return (
    <div className="paciente-detail-page">
      <div className="back-link" onClick={() => navigate('/pacientes')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </div>

      <div className="detail-container">
        <div className="detail-header">
          <h1>{paciente.nome}</h1>
          <button 
            onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}
            className="btn btn-warning"
          >
            Editar
          </button>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <strong>CPF:</strong>
            <span>{paciente.cpf}</span>
          </div>
          <div className="detail-row">
            <strong>Data de Nascimento:</strong>
            <span>{new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</span>
          </div>
          {paciente.telefone && (
            <div className="detail-row">
              <strong>Telefone:</strong>
              <span>{paciente.telefone}</span>
            </div>
          )}
          {paciente.email && (
            <div className="detail-row">
              <strong>Email:</strong>
              <span>{paciente.email}</span>
            </div>
          )}
          {paciente.endereco && (
            <div className="detail-row">
              <strong>Endereço:</strong>
              <span>{paciente.endereco}</span>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h2>Consultas Recentes</h2>
          <p>Consultas serão listadas aqui</p>
        </div>

        <div className="detail-section">
          <h2>Prontuários</h2>
          <p>Prontuários serão listados aqui</p>
        </div>
      </div>
    </div>
  );
};

export default PacienteDetailPage;