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
        <div className="consultas-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {prontuarios.map((prontuario) => (
            <div
              key={prontuario.id}
              className="bg-white border-l-4 border-l-gray-300 shadow-sm rounded-lg p-6 mb-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3 text-gray-600" style={{ paddingLeft: '10px' }}>
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
