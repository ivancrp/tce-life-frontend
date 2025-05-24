import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { medicamentoService, Medicamento } from '../services/medicamento.service';
import AddMedicationStepsModal from '../components/AddMedicationStepsModal';
import EditMedicationModal from '../components/EditMedicationModal';

const Inventory = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medicamento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      const data = await medicamentoService.getAll();
      setMedicamentos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error('Erro ao buscar medicamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (medication: Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await medicamentoService.create(medication);
      fetchMedicamentos();
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao adicionar medicamento');
      console.error('Erro ao adicionar medicamento:', err);
    }
  };

  const handleEditMedication = async (medication: Partial<Medicamento>) => {
    try {
      if (selectedMedication?.id) {
        await medicamentoService.update(selectedMedication.id, medication);
        fetchMedicamentos();
        setIsEditModalOpen(false);
        setSelectedMedication(null);
      }
    } catch (err) {
      setError('Erro ao editar medicamento');
      console.error('Erro ao editar medicamento:', err);
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        await medicamentoService.delete(id);
        fetchMedicamentos();
      } catch (err) {
        setError('Erro ao excluir medicamento');
        console.error('Erro ao excluir medicamento:', err);
      }
    }
  };

  const filteredMedicamentos = medicamentos.filter(medicamento =>
    medicamento.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicamento.nomeGenerico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicamento.fabricante?.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    medicamento.lote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isExpired = (dateString: string) => {
    const date = new Date(dateString);
    return date < new Date();
  };

  const isAboutToExpire = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estoque de Medicamentos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Adicionar Medicamento
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <AlertCircle className="inline-block w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredMedicamentos.map((medicamento) => (
              <li key={medicamento.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{medicamento.nomeComercial}</h3>
                    <p className="text-sm text-gray-500">Nome Genérico: {medicamento.nomeGenerico}</p>
                    <p className="text-sm text-gray-500">Fabricante: {medicamento.fabricante?.nome || 'Não especificado'}</p>
                    <p className="text-sm text-gray-500">
                      Lote: {medicamento.lote} | Validade: {formatDate(medicamento.dataValidade)}
                      {isExpired(medicamento.dataValidade) && (
                        <span className="ml-2 text-red-600">Vencido</span>
                      )}
                      {isAboutToExpire(medicamento.dataValidade) && (
                        <span className="ml-2 text-yellow-600">Próximo ao vencimento</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Estoque: {medicamento.quantidadeEstoque} {medicamento.unidadeMedida}
                      {medicamento.quantidadeEstoque <= medicamento.quantidadeMinima && (
                        <span className="ml-2 text-red-600">Estoque baixo</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedMedication(medicamento);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedication(medicamento.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <AddMedicationStepsModal
          onSubmit={handleAddMedication}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedMedication && (
        <EditMedicationModal
          medication={selectedMedication}
          onSubmit={handleEditMedication}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMedication(null);
          }}
        />
      )}
    </div>
  );
};

export default Inventory; 