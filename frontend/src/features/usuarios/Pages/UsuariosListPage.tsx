import React from 'react';
import { usuariosService } from '../../../services/endpoints/users.service';
import { Usuario } from '@/types/user.types';

const UsuariosListPage: React.FC = () => {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadUsuarios = async () => {
      try {
        setLoading(true);
        const data = await usuariosService.getAll();
        setUsuarios(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadUsuarios();
  }, []);

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="usuarios-list-page">
      <h1>👥 Usuários</h1>

      {error && <div className="error-box">{error}</div>}

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="usuarios-grid">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="usuario-card border rounded p-4 shadow mb-4">
              <div className="card-header mb-2">
                <h3 className="text-lg font-semibold">{usuario.nome}</h3>
                <span className="text-sm text-gray-600 capitalize">{usuario.tipo.toLowerCase()}</span>
              </div>
              <div className="card-body text-sm text-gray-700 space-y-1">
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>CPF:</strong> {usuario.cpf}</p>
                {usuario.telefone && <p><strong>Telefone:</strong> {usuario.telefone}</p>}
                {usuario.endereco && <p><strong>Endereço:</strong> {usuario.endereco}</p>}
                {usuario.dataNascimento && (
                  <p>
                    <strong>Data de Nascimento:</strong> {new Date(usuario.dataNascimento).toLocaleDateString()}
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

export default UsuariosListPage;
