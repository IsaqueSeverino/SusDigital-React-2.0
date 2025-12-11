import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { 
  LayoutDashboard, 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Stethoscope, 
  ClipboardList 
} from "lucide-react";
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
          <Link to="/" className={`nav-item flex items-center gap-2 ${isActive("")}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </div>

        {user?.tipo === "MEDICO" && (
          <div className="nav-section">
            <h3>Médico</h3>
            <Link
              to="/pacientes"
              className={`nav-item flex items-center gap-2 ${isActive("pacientes")}`}
            >
              <User size={20} />
              Pacientes
            </Link>
            <Link
              to="/consultas-medico"
              className={`nav-item flex items-center gap-2 ${isActive("minhas-consultas")}`}
            >
              <Calendar size={20} />
              Minhas Consultas
            </Link>
            <Link
              to="/prontuarios"
              className={`nav-item flex items-center gap-2 ${isActive("prontuarios")}`}
            >
              <FileText size={20} />
              Prontuários
            </Link>
          </div>
        )}

        {user?.tipo === "ADMIN" && (
          <div className="nav-section">
            <h3>Administração</h3>
            <Link to="/usuarios" className={`nav-item flex items-center gap-2 ${isActive("usuarios")}`}>
              <Users size={20} />
              Usuários
            </Link>
            <Link to="/medicos" className={`nav-item flex items-center gap-2 ${isActive("medicos")}`}>
              <Stethoscope size={20} />
              Médicos
            </Link>
            <Link
              to="/consultas"
              className={`nav-item flex items-center gap-2 ${isActive("consultas")}`}
            >
              <Calendar size={20} />
              Consultas
            </Link>
          </div>
        )}

        {user?.tipo === "PACIENTE" && (
          <div className="nav-section">
            <h3>Minha Área</h3>
            <Link to="/minhas-consultas" className={`nav-item flex items-center gap-2 ${isActive("usuarios")}`}>
              <Calendar size={20} />
              Minhas consultas
            </Link>
            <Link to="/meus-exames" className={`nav-item flex items-center gap-2 ${isActive("usuarios")}`}>
              <ClipboardList size={20} />
              Meus exames
            </Link>
            <Link to="/meus-prontuarios" className={`nav-item flex items-center gap-2 ${isActive("usuarios")}`}>
              <FileText size={20} />
              Meus prontuários
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
