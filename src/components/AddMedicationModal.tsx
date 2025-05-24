import React, { useState, useEffect } from 'react';
import { X, Package, Building, Hash, Calendar, Scale, AlertCircle, Info, Thermometer, Box, Pill, FileText } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api';

interface Fabricante {
  id: string;
  nome: string;
  registroAnvisa: string;
}

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: {
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
  }) => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
  const [formData, setFormData] = useState({
    nomeComercial: '',
    nomeGenerico: '',
    codigoInterno: '',
    apresentacao: '',
    formaFarmaceutica: '',
    dosagem: '',
    unidadeMedida: '',
    registroAnvisa: '',
    lote: '',
    dataFabricacao: '',
    dataValidade: '',
    quantidadeEstoque: 0,
    quantidadeMinima: 0,
    localArmazenamento: '',
    condicoesArmazenamento: '',
    tipoControle: '',
    classificacaoTerapeutica: '',
    necessitaPrescricao: false,
    restricoesUso: '',
    indicacoes: '',
    contraIndicacoes: '',
    efeitosColaterais: '',
    posologiaPadrao: '',
    observacoes: '',
    fabricanteId: ''
  });

  useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/fabricantes`);
        setFabricantes(response.data);
      } catch (error) {
        console.error('Erro ao buscar fabricantes:', error);
      }
    };

    if (isOpen) {
      fetchFabricantes();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      nomeComercial: '',
      nomeGenerico: '',
      codigoInterno: '',
      apresentacao: '',
      formaFarmaceutica: '',
      dosagem: '',
      unidadeMedida: '',
      registroAnvisa: '',
      lote: '',
      dataFabricacao: '',
      dataValidade: '',
      quantidadeEstoque: 0,
      quantidadeMinima: 0,
      localArmazenamento: '',
      condicoesArmazenamento: '',
      tipoControle: '',
      classificacaoTerapeutica: '',
      necessitaPrescricao: false,
      restricoesUso: '',
      indicacoes: '',
      contraIndicacoes: '',
      efeitosColaterais: '',
      posologiaPadrao: '',
      observacoes: '',
      fabricanteId: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cadastrar Novo Medicamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identificação do Medicamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identificação do Medicamento</h3>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nomeComercial"
                  value={formData.nomeComercial}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nome Comercial"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Pill className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nomeGenerico"
                  value={formData.nomeGenerico}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nome Genérico"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="codigoInterno"
                  value={formData.codigoInterno}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Código Interno"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="apresentacao"
                  value={formData.apresentacao}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Apresentação"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Pill className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="formaFarmaceutica"
                  value={formData.formaFarmaceutica}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Forma Farmacêutica"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="dosagem"
                    value={formData.dosagem}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Dosagem"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="unidadeMedida"
                    value={formData.unidadeMedida}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Unidade de Medida"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações do Fabricante e Lote */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Fabricante e Lote</h3>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="fabricanteId"
                  value={formData.fabricanteId}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Selecione o Fabricante</option>
                  {fabricantes.map(fabricante => (
                    <option key={fabricante.id} value={fabricante.id}>
                      {fabricante.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="registroAnvisa"
                  value={formData.registroAnvisa}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Registro ANVISA"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="lote"
                  value={formData.lote}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Número do Lote"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dataFabricacao"
                    value={formData.dataFabricacao}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dataValidade"
                    value={formData.dataValidade}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações de Estoque */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações de Estoque</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantidadeEstoque"
                    value={formData.quantidadeEstoque}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Quantidade em Estoque"
                    required
                    min="0"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantidadeMinima"
                    value={formData.quantidadeMinima}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Quantidade Mínima"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="localArmazenamento"
                  value={formData.localArmazenamento}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Local de Armazenamento"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Thermometer className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="condicoesArmazenamento"
                  value={formData.condicoesArmazenamento}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Condições de Armazenamento"
                  required
                />
              </div>
            </div>

            {/* Classificação e Controle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Classificação e Controle</h3>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="tipoControle"
                  value={formData.tipoControle}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Selecione o Tipo de Controle</option>
                  <option value="Uso comum">Uso comum</option>
                  <option value="Antibiótico">Antibiótico</option>
                  <option value="Psicotrópico">Psicotrópico</option>
                  <option value="Controlado">Controlado</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="classificacaoTerapeutica"
                  value={formData.classificacaoTerapeutica}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Classificação Terapêutica"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="necessitaPrescricao"
                  checked={formData.necessitaPrescricao}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Necessita Prescrição Médica
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="restricoesUso"
                  value={formData.restricoesUso}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Restrições de Uso"
                />
              </div>
            </div>

            {/* Informações Complementares */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Complementares</h3>

              <div className="relative">
                <textarea
                  name="indicacoes"
                  value={formData.indicacoes}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Indicações"
                  rows={3}
                />
              </div>

              <div className="relative">
                <textarea
                  name="contraIndicacoes"
                  value={formData.contraIndicacoes}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Contraindicações"
                  rows={3}
                />
              </div>

              <div className="relative">
                <textarea
                  name="efeitosColaterais"
                  value={formData.efeitosColaterais}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Efeitos Colaterais"
                  rows={3}
                />
              </div>

              <div className="relative">
                <textarea
                  name="posologiaPadrao"
                  value={formData.posologiaPadrao}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Posologia Padrão"
                  rows={3}
                />
              </div>

              <div className="relative">
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Observações Gerais"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationModal; 