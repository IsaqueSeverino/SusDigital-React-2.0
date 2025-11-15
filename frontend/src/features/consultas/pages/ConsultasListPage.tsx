import React from 'react';
import { useConsultas } from '../hooks/useConsultas';
import { Link } from 'react-router-dom';
import '../styles/ConsultasList.css';

const ConsultasListPage: React.FC = () => {
  const { consultas, loading, error } = useConsultas();

  if (loading) {
    return <div className="loading">Carregando consultas...</div>;
  }

  return (
    <div className="consultas-list-page">
      <div className="page-header">
        <h1>📅 Consultas</h1>
        <Link to="/consultas/agendar" className="btn btn-primary">
          ➕ Agendar Consulta
        </Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!Array.isArray(consultas) || consultas.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma consulta encontrada</p>
        </div>
      ) : (
        <div className="consultas-list">
          {consultas.map((consulta) => (
            <div key={consulta.id} className="consulta-item">
              <div className="consulta-header">
                <span className={`status ${consulta.status.toLowerCase()}`}>
                  {consulta.status}
                </span>
              </div>
              <div className="consulta-body">
                <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleDateString('pt-BR')}</p>
                <p><strong>Hora:</strong> {new Date(consulta.dataHora).toLocaleTimeString('pt-BR')}</p>
                {consulta.descricao && (
                  <p><strong>Descrição:</strong> {consulta.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultasListPage;
