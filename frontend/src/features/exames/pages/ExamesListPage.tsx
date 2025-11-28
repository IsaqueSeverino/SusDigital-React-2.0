import React from "react";
import { useExames } from "../hooks/useExames";
import "../styles/ExamesListPage.css";

const ExamesListPage: React.FC = () => {
  const { exames, loading, error } = useExames();

  if (loading) {
    return <div className="loading">Carregando exames...</div>;
  }

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const pacienteId = user?.perfil?.id

  const examesDoUsuario = exames.filter((exame) => {
    if (!exame.consulta) return false;
    if (pacienteId) return exame.consulta.pacienteId === pacienteId;
    return false;
  });

  return (
    <div className="consultas-list-page">
      <div className="page-header">
        <h1>Exames</h1>
      </div>

      {error && <div className="error-box">{error}</div>}

      {examesDoUsuario.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum exame encontrado</p>
        </div>
      ) : (
        <div className="consultas-list">
          {examesDoUsuario.map((exame) => (
            <div key={exame.id} className="consulta-item">
              <div className="consulta-header">
                <span className="status agendada br">Exame solicitado pelo médico {exame.consulta?.medico?.nome} na consulta do dia {exame.consulta?.dataHora} do tipo {exame.tipo}</span>
              </div>
              <div className="consulta-body">
                <p>
                  <strong>Nome do exame:</strong> {exame.nome}
                </p>
                <p>
                  <strong>Data do exame:</strong>{" "}
                  {new Date(exame.dataExame).toLocaleDateString("pt-BR")}
                </p>
                {exame.resultado && (
                  <p>
                    <strong>Resultado:</strong> {exame.resultado}
                  </p>
                )}
                {exame.observacoes && (
                  <p>
                    <strong>Observações:</strong> {exame.observacoes}
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

export default ExamesListPage;
