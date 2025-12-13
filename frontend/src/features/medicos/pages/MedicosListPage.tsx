import React from 'react';
import { Stethoscope } from 'lucide-react';
import { medicosService } from '../../../services/endpoints/medicos.service';
import { Medico } from '@/types/medico.types';
import '../styles/MedicosListPage.css';

const MedicosListPage: React.FC = () => {
  const [medicos, setMedicos] = React.useState<Medico[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadMedicos = async () => {
      try {
        setLoading(true);
        const data = await medicosService.getAll();
        setMedicos(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar médicos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadMedicos();
  }, []);

  if (loading) {
    return <div className="loading">Carregando médicos...</div>;
  }

  return (
    <div className="medicos-list-page">
      <h1 className="flex items-center gap-2">
        <Stethoscope className="w-5 h-5" />
        Médicos
      </h1>

      {error && <div className="error-box">{error}</div>}

      {medicos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum médico encontrado</p>
        </div>
      ) : (
        <div className="medicos-grid">
          {medicos.map((medico) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicosListPage;