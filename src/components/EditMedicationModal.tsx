import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Medicamento } from '../services/medicamento.service';

interface EditMedicationModalProps {
  onSubmit: (medication: Partial<Medicamento>) => void;
  onClose: () => void;
  medication: Medicamento;
}

const EditMedicationModal = ({ onSubmit, onClose, medication }: EditMedicationModalProps) => {
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
    if (medication) {
      setFormData({
        ...medication,
        dataFabricacao: medication.dataFabricacao.split('T')[0],
        dataValidade: medication.dataValidade.split('T')[0]
      });
    }
  }, [medication]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!medication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Medicamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Comercial</label>
              <input
                type="text"
                name="nomeComercial"
                value={formData.nomeComercial}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Genérico</label>
              <input
                type="text"
                name="nomeGenerico"
                value={formData.nomeGenerico}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Interno</label>
              <input
                type="text"
                name="codigoInterno"
                value={formData.codigoInterno}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apresentação</label>
              <input
                type="text"
                name="apresentacao"
                value={formData.apresentacao}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Forma Farmacêutica</label>
              <input
                type="text"
                name="formaFarmaceutica"
                value={formData.formaFarmaceutica}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dosagem</label>
              <input
                type="text"
                name="dosagem"
                value={formData.dosagem}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
              <input
                type="text"
                name="unidadeMedida"
                value={formData.unidadeMedida}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registro ANVISA</label>
              <input
                type="text"
                name="registroAnvisa"
                value={formData.registroAnvisa}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lote</label>
              <input
                type="text"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Fabricação</label>
              <input
                type="date"
                name="dataFabricacao"
                value={formData.dataFabricacao}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Validade</label>
              <input
                type="date"
                name="dataValidade"
                value={formData.dataValidade}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
              <input
                type="number"
                name="quantidadeEstoque"
                value={formData.quantidadeEstoque}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade Mínima</label>
              <input
                type="number"
                name="quantidadeMinima"
                value={formData.quantidadeMinima}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Local de Armazenamento</label>
              <input
                type="text"
                name="localArmazenamento"
                value={formData.localArmazenamento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condições de Armazenamento</label>
              <input
                type="text"
                name="condicoesArmazenamento"
                value={formData.condicoesArmazenamento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Controle</label>
              <select
                name="tipoControle"
                value={formData.tipoControle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="CONTROLADO">Controlado</option>
                <option value="NAO_CONTROLADO">Não Controlado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Classificação Terapêutica</label>
              <input
                type="text"
                name="classificacaoTerapeutica"
                value={formData.classificacaoTerapeutica}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <label className="ml-2 block text-sm text-gray-900">Necessita Prescrição</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Restrições de Uso</label>
            <textarea
              name="restricoesUso"
              value={formData.restricoesUso}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Indicações</label>
            <textarea
              name="indicacoes"
              value={formData.indicacoes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Contraindicações</label>
            <textarea
              name="contraIndicacoes"
              value={formData.contraIndicacoes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Efeitos Colaterais</label>
            <textarea
              name="efeitosColaterais"
              value={formData.efeitosColaterais}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Posologia Padrão</label>
            <textarea
              name="posologiaPadrao"
              value={formData.posologiaPadrao}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicationModal; 