import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePacientes } from "../hooks/usePacientes";
import "../styles/PacientesListPage.css";

const PacientesListPage: React.FC = () => {
  const { pacientes, loading, error, search } = usePacientes();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    await search(term);
  };

  if (loading && pacientes.length === 0) {
    return <div className="loading">Carregando pacientes...</div>;
  }

  return (
    <div className="pacientes-list-page">
      <div className="page-header">
        <h1>Pacientes</h1>
        <Link to="/pacientes/novo" className="btn btn-primary">
          Novo Paciente
        </Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {error && <div className="error-box">{error}</div>}

      {pacientes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="pacientes-grid">
          {pacientes.map((paciente) => (
            <div key={paciente.id} className="paciente-card">
              <div className="card-header">
                <h3>{paciente.nome}</h3>
              </div>
              <div className="card-body">
                <p>
                  <strong>CPF:</strong> {paciente.cpf}
                </p>
                <p>
                  <strong>Data de Nascimento:</strong>{" "}
                  {new Date(paciente.dataNascimento).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
                {paciente.telefone && (
                  <p>
                    <strong>Telefone:</strong> {paciente.telefone}
                  </p>
                )}
                {paciente.email && (
                  <p>
                    <strong>Email:</strong> {paciente.email}
                  </p>
                )}
              </div>
              <div className="card-footer">
                <Link
                  to={`/pacientes/${paciente.id}`}
                  className="btn btn-sm btn-info"
                >
                  Ver Detalhes
                </Link>
                <Link
                  to={`/pacientes/${paciente.id}/editar`}
                  className="btn btn-sm btn-warning"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PacientesListPage;
