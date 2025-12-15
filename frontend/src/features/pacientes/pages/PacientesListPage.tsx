import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { usePacientes } from "../hooks/usePacientes";
import "../styles/PacientesListPage.css";
import Loading from "@/components/common/Loading";

const PacientesListPage: React.FC = () => {
  const { pacientes, loading, error } = usePacientes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPacientes = pacientes.filter((paciente) => {
    const term = searchTerm.toLowerCase();
    return (
      paciente.nome.toLowerCase().includes(term) ||
      paciente.cpf.includes(term) ||
      (paciente.email && paciente.email.toLowerCase().includes(term)) ||
      (paciente.cartaoSus && paciente.cartaoSus.includes(term))
    );
  });

  if (loading && pacientes.length === 0) {
    return <Loading message="Carregando pacientes..." />;
  }

  return (
    <div className="pacientes-list-page">
      <div className="page-header">
        <h1>Pacientes</h1>
        <Link to="/pacientes/novo" className="btn btn-primary">
          Novo Paciente
        </Link>
      </div>

      <div className="relative mb-6" style={{paddingBottom: "20px"}}>
        <Search className="absolute left-3 top-3.5 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          style={{paddingLeft: "40px"}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {error && <div className="error-box">{error}</div>}

      {filteredPacientes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="pacientes-grid">
          {filteredPacientes.map((paciente) => (
            <div key={paciente.id} className="paciente-card">
              <div className="card-header">
                <h3>{paciente.nome}</h3>
              </div>
              <div className="card-body">
                <p>
                  <strong>CPF:</strong> {paciente.cpf}
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
