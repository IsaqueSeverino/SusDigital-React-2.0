import React from 'react';
import '../styles/ProntuariosListPage.css';

const ProntuariosListPage: React.FC = () => {
  return (
    <div className="prontuarios-list-page">
      <div className="page-header">
        <h1>📄 Prontuários</h1>
      </div>

      <div className="empty-state">
        <p>Seção de Prontuários em desenvolvimento</p>
      </div>
    </div>
  );
};

export default ProntuariosListPage;