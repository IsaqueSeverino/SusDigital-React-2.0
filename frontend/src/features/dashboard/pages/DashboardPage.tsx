import React from 'react';
import '../styles/DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1>📊 Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Pacientes</h3>
          <p className="card-value">--</p>
          <p className="card-label">Total de pacientes</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👨‍⚕️</div>
          <h3>Médicos</h3>
          <p className="card-value">--</p>
          <p className="card-label">Total de médicos</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📅</div>
          <h3>Consultas</h3>
          <p className="card-value">--</p>
          <p className="card-label">Total de consultas</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h3>Prontuários</h3>
          <p className="card-value">--</p>
          <p className="card-label">Total de prontuários</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Próximas Consultas</h2>
        <p>Consultas serão listadas aqui</p>
      </div>
    </div>
  );
};

export default DashboardPage;