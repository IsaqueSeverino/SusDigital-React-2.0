import React, { useState } from "react";
import { useUsers } from "../hooks/useUsuarios";
import { Trash2 } from "lucide-react";
import "../styles/UsuariosListPage.css";
import Loading from "@/components/common/Loading";

const UsuariosListPage: React.FC = () => {
  const { users: usuarios, loading, error, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("TODOS");

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(id);
      } catch (err) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterTipo === "TODOS" || usuario.tipo === filterTipo;

    return matchesSearch && matchesType;
  });

  const getBadgesColor = (tipo: string) => {
    switch (tipo) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "MEDICO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PACIENTE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <Loading className="h-64" />;
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-500 mt-1">Visualize e gerencie os usuários do sistema</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou email"
              className="w-56 pl-14 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              style={{ paddingLeft: '28px'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-1 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            value={filterTipo}
            style={{ paddingLeft: '10px'}}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="MEDICO">Médicos</option>
            <option value="PACIENTE">Pacientes</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalhes
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                            ${usuario.tipo === 'MEDICO' ? 'bg-blue-500' : usuario.tipo === 'PACIENTE' ? 'bg-green-500' : 'bg-purple-500'}`}>
                            {(usuario.medico?.nome || usuario.paciente?.nome || "U").charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.medico?.nome || usuario.paciente?.nome || "Usuário Sistema"}
                          </div>
                          <div className="text-xs text-gray-500">ID: {usuario.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgesColor(usuario.tipo)}`}>
                        {usuario.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                      {usuario.medico && (
                        <div className="flex flex-col">
                          <span className="font-medium">CRM: {usuario.medico.crm}</span>
                          <span className="text-xs">{usuario.medico.especialidade}</span>
                        </div>
                      )}
                      {usuario.paciente && (
                        <div className="flex flex-col">
                          <span>CPF: {usuario.paciente.cpf}</span>
                          <span className="text-xs">SUS: {usuario.paciente.cartaoSus}</span>
                        </div>
                      )}
                      {!usuario.medico && !usuario.paciente && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {usuario.ativo ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            Ativo
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Excluir Usuário"
                      >
                         <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tente ajustar os filtros ou sua busca.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Total de registros: {filteredUsuarios.length} de {usuarios.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsuariosListPage;
