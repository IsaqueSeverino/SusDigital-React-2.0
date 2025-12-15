import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Search, Trash2, Edit, FileText } from 'lucide-react';
import { useMedicos } from '../hooks/useMedicos';
import '../styles/MedicosListPage.css';
import Loading from '@/components/common/Loading';

const MedicosListPage: React.FC = () => {
  const navigate = useNavigate();
  const { medicos, loading, error, deleteMedico } = useMedicos();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este médico?')) {
      try {
        await deleteMedico(id);
      } catch (error) {
        alert('Erro ao excluir médico. Verifique se existem consultas vinculadas.');
      }
    }
  };

  const filteredMedicos = medicos.filter((medico) => {
    const term = searchTerm.toLowerCase();
    const nome = medico.nome?.toLowerCase() || "";
    const especialidade = medico.especialidade?.toLowerCase() || "";
    const crm = medico.crm || "";
    
    return nome.includes(term) || especialidade.includes(term) || crm.includes(term);
  });

  if (loading && medicos.length === 0) {
    return <Loading className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="medicos-list-page">
      <div className="page-header">
        <h1 className="flex items-center gap-2">
          <Stethoscope className="w-8 h-8" />
          Médicos
        </h1>
        <Link to="/medicos/novo" className="btn btn-primary">
          Novo Médico
        </Link>
      </div>

      <div className="relative mb-6" style={{paddingBottom: "20px"}}>
        <Search className="absolute left-3 top-3.5 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, CRM ou especialidade..."
          style={{paddingLeft: "40px"}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {error && <div className="error-box">{error}</div>}

      {filteredMedicos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum médico encontrado</p>
        </div>
      ) : (
        <div className="medicos-grid">
          {filteredMedicos.map((medico) => (
            <div key={medico.id} className="medico-card">
              <div className="card-header">
                <h3>{medico.nome}</h3>
              </div>
              <div className="card-body">
                <p><strong>CRM:</strong> {medico.crm}</p>
                <p><strong>Especialidade:</strong> {medico.especialidade}</p>
                {medico.telefone && <p><strong>Telefone:</strong> {medico.telefone}</p>}
                {medico.email && <p><strong>Email:</strong> {medico.email}</p>}
              </div>
              <div className="card-footer flex gap-2">
                <Link
                   to={`/medicos/${medico.id}`}
                   className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2"
                >
                  <FileText size={16} />
                  Detalhes
                </Link>
                <button 
                  onClick={() => navigate(`/medicos/${medico.id}/editar`)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(medico.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 gap-2"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicosListPage;