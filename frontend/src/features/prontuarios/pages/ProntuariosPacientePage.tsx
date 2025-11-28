import React from "react";
import { useProntuarios } from "../hooks/useProntuarios";
import "../styles/ProntuariosPacientePage.css";

const ProntuariosPacientePage: React.FC = () => {
  const { prontuarios, loading, error } = useProntuarios();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const pacienteId = user?.perfil?.id

  const meusProntuarios = prontuarios.filter(
    (p) => p.pacienteId === pacienteId
  );

  if (loading) {
    return <div className="loading">Carregando prontuários...</div>;
  }

  return (
    <div className="prontuarios-list-page">
      <div className="page-header">
        <h1>Meus Prontuários</h1>
      </div>

      {error && <div className="error-box">{error}</div>}

      {meusProntuarios.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum prontuário encontrado</p>
        </div>
      ) : (
        <div className="consultas-list">
          {meusProntuarios.map((prontuario) => (
            <div key={prontuario.id} className="consulta-item">
              <div className="consulta-body">
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(prontuario.data).toLocaleDateString("pt-BR")}
                </p>

                {prontuario.diagnostico && (
                  <p>
                    <strong>Diagnóstico:</strong> {prontuario.diagnostico}
                  </p>
                )}
                {prontuario.sintomas && (
                  <p>
                    <strong>Sintomas:</strong> {prontuario.sintomas}
                  </p>
                )}
                {prontuario.tratamento && (
                  <p>
                    <strong>Tratamento:</strong> {prontuario.tratamento}</p>
                )}
                {prontuario.observacoes && (
                  <p>
                    <strong>Observações:</strong> {prontuario.observacoes}
                  </p>
                )}
                {prontuario.paciente && (
                  <p>
                    <strong>Paciente:</strong> {prontuario.paciente.nome} (CPF:{" "}
                    {prontuario.paciente.cpf}, Cartão SUS:{" "}
                    {prontuario.paciente.cartaoSus})
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProntuariosPacientePage;
