import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import './Header.css';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="toggle-sidebar-btn" 
            onClick={onToggleSidebar}
            title="Alternar menu"
          >
            ☰
          </button>
          <Link to="/" className="logo">
            <h1>🏥 SUS Digital</h1>
          </Link>
        </div>

        <div className="header-right">
          <div className="user-menu">
            <div 
              className="user-info"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span className="user-name">{user?.nome}</span>
              <span className="user-role">{user?.tipo}</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/perfil" className="dropdown-item">Perfil</Link>
                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
