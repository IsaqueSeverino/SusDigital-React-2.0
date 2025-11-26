import React from "react";
import { useConsultas } from "../hooks/useConsultas";
import { Link } from "react-router-dom";
import "../styles/ConsultasList.css";

const ConsultasListPage: React.FC = () => {
  const { consultas, loading, error } = useConsultas();

  if (loading) {
    return <div className="loading">Carregando consultas...</div>;
  }

  return (
    <div className="consultas-list-page">
      <div className="page-header">
        <h1>Consultas</h1>
        <Link to="/consultas/agendar" className="btn btn-primary">
          Agendar Consulta
        </Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      {consultas.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma consulta encontrada</p>
        </div>
      ) : (
        <div className="consultas-list">
          {consultas.map((consulta) => (
            <div key={consulta.id} className="consulta-item">
              <div className="consulta-header">
                {consulta.status && (
                  <span className={`status ${consulta.status.toLowerCase()}`}>
                    {consulta.status}
                  </span>
                )}
              </div>
              <div className="consulta-body">
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(consulta.dataHora).toLocaleDateString("pt-BR")}
                </p>
                <p>
                  <strong>Hora:</strong>{" "}
                  {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {consulta.motivo && (
                  <p>
                    <strong>Motivo:</strong> {consulta.motivo}
                  </p>
                )}
                {consulta.observacoes && (
                  <p>
                    <strong>Observações:</strong> {consulta.observacoes}
                  </p>
                )}
                {consulta.medico && (
                  <p>
                    <strong>Médico:</strong> {consulta.medico.nome} (
                    {consulta.medico.especialidade}, CRM: {consulta.medico.crm})
                  </p>
                )}
                {consulta.paciente && (
                  <p>
                    <strong>Paciente:</strong> {consulta.paciente.nome} (CPF:{" "}
                    {consulta.paciente.cpf}, Cartão SUS:{" "}
                    {consulta.paciente.cartaoSus})
                  </p>
                )}
                {consulta.exames && consulta.exames.length > 0 && (
                  <div className="consulta-exames">
                    <strong>Exames:</strong>
                    <ul>
                      {consulta.exames.map((exame) => (
                        <li key={exame.id}>
                          {exame.nome} ({exame.tipo}) em{" "}
                          {new Date(exame.dataExame).toLocaleDateString(
                            "pt-BR"
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
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
