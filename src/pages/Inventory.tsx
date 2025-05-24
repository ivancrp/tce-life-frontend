import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { API_URL } from '../config/api';
import AddMedicationStepsModal from '../components/AddMedicationStepsModal';
import EditMedicationModal from '../components/EditMedicationModal';

interface Medicamento {
  id: string;
  nomeComercial: string;
  nomeGenerico: string;
  codigoInterno: string;
  apresentacao: string;
  formaFarmaceutica: string;
  dosagem: string;
  unidadeMedida: string;
  registroAnvisa: string;
  lote: string;
  dataFabricacao: string;
  dataValidade: string;
  quantidadeEstoque: number;
  quantidadeMinima: number;
  localArmazenamento: string;
  condicoesArmazenamento: string;
  tipoControle: string;
  classificacaoTerapeutica: string;
  necessitaPrescricao: boolean;
  restricoesUso?: string;
  indicacoes?: string;
  contraIndicacoes?: string;
  efeitosColaterais?: string;
  posologiaPadrao?: string;
  observacoes?: string;
  fabricanteId: string;
  fabricante: {
    id: string;
    nome: string;
    registroAnvisa: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
      const response = await axios.get(`${API_URL}/medicamentos`);
      setMedicamentos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error('Erro ao buscar medicamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (medication: {
    nomeComercial: string;
    nomeGenerico: string;
    codigoInterno: string;
    apresentacao: string;
    formaFarmaceutica: string;
    dosagem: string;
    unidadeMedida: string;
    registroAnvisa: string;
    lote: string;
    dataFabricacao: string;
    dataValidade: string;
    quantidadeEstoque: number;
    quantidadeMinima: number;
    localArmazenamento: string;
    condicoesArmazenamento: string;
    tipoControle: string;
    classificacaoTerapeutica: string;
    necessitaPrescricao: boolean;
    restricoesUso?: string;
    indicacoes?: string;
    contraIndicacoes?: string;
    efeitosColaterais?: string;
    posologiaPadrao?: string;
    observacoes?: string;
    fabricanteId: string;
  }) => {
    try {
      await axios.post(`${API_URL}/medicamentos`, medication);
      fetchMedicamentos();
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao adicionar medicamento');
      console.error('Erro ao adicionar medicamento:', err);
    }
  };

  const handleEditMedication = async (medication: any) => {
    try {
      await axios.put(`${API_URL}/medicamentos/${selectedMedication?.id}`, medication);
      fetchMedicamentos();
      setIsEditModalOpen(false);
      setSelectedMedication(null);
    } catch (err) {
      setError('Erro ao editar medicamento');
      console.error('Erro ao editar medicamento:', err);
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        await axios.delete(`${API_URL}/medicamentos/${id}`);
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
                    <p className="text-sm text-gray-500">Lote: {medicamento.lote}</p>
                    <p className="text-sm text-gray-500">
                      Quantidade: {medicamento.quantidadeEstoque} {medicamento.unidadeMedida}
                    </p>
                    <p className="text-sm text-gray-500">
                      Validade: {formatDate(medicamento.dataValidade)}
                    </p>
                    <div className="mt-2">
                      {isExpired(medicamento.dataValidade) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Vencido
                        </span>
                      ) : isAboutToExpire(medicamento.dataValidade) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Próximo ao vencimento
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Válido
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedMedication(medicamento);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMedication(medicamento.id)}
                      className="p-2 text-red-600 hover:text-red-800"
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

      <AddMedicationStepsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMedication}
      />

      <EditMedicationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMedication(null);
        }}
        onSave={handleEditMedication}
        medication={selectedMedication}
      />
    </div>
  );
};

export default Inventory; 