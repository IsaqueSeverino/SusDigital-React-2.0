import React from "react";
import { useProntuarios } from "../hooks/useProntuarios";
import "../styles/ProntuariosListPage.css"; // pode deixar, não interfere

const ProntuariosListPage: React.FC = () => {
  const { prontuarios, loading, error } = useProntuarios();

  if (loading) {
    return <div className="loading">Carregando prontuários...</div>;
  }

  console.log(prontuarios);

  return (
    <div className="prontuarios-list-page">
      <div className="page-header">
        <h1>Prontuários</h1>
      </div>

      {error && <div className="error-box">{error}</div>}

      {prontuarios.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum prontuário encontrado</p>
        </div>
      ) : (
        <div className="consultas-list ">
          {prontuarios.map((prontuario) => (
            <div
              key={prontuario.id}
              className="consulta-item border border-black p-4 mb-4 last:mb-0 rounded"
            >
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
                    <strong>Tratamento:</strong> {prontuario.tratamento}
                  </p>
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

export default ProntuariosListPage;
