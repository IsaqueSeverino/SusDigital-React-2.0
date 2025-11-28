import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path) ? "active" : "";
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Menu Principal</h3>
          <Link to="/" className={`nav-item ${isActive("")}`}>
            Dashboard
          </Link>
        </div>

        {user?.tipo === "MEDICO" && (
          <div className="nav-section">
            <h3>Médico</h3>
            <Link
              to="/pacientes"
              className={`nav-item ${isActive("pacientes")}`}
            >
              Pacientes
            </Link>
            <Link
              to="/consultas-medico"
              className={`nav-item ${isActive("minhas-consultas")}`}
            >
              Minhas Consultas
            </Link>
            <Link
              to="/prontuarios"
              className={`nav-item ${isActive("prontuarios")}`}
            >
              Prontuários
            </Link>
          </div>
        )}

        {user?.tipo === "ADMIN" && (
          <div className="nav-section">
            <h3>Administração</h3>
            <Link to="/usuarios" className={`nav-item ${isActive("usuarios")}`}>
              Usuários
            </Link>
            <Link to="/medicos" className={`nav-item ${isActive("medicos")}`}>
              Médicos
            </Link>
            <Link
              to="/consultas"
              className={`nav-item ${isActive("consultas")}`}
            >
              Consultas
            </Link>
          </div>
        )}

        {user?.tipo === "PACIENTE" && (
          <div className="nav-section">
            <h3>Minha Área</h3>
            <Link to="/minhas-consultas" className={`nav-item ${isActive("usuarios")}`}>
              Minhas consultas
            </Link>
            <Link to="/meus-exames" className={`nav-item ${isActive("usuarios")}`}>
              Meus exames
            </Link>
            <Link to="/meus-prontuarios" className={`nav-item ${isActive("usuarios")}`}>
              Meus prontuários
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
