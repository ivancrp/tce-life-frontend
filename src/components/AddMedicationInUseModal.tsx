import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface MedicationInUse {
  nome: string;
  dosagem: string;
  frequencia: string;
  dataInicio: string;
  dataFim: string;
  instrucoes: string;
  status: 'ativo' | 'inativo';
  prescritoPor: string;
}

interface AddMedicationInUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: MedicationInUse) => void;
}

const AddMedicationInUseModal: React.FC<AddMedicationInUseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [medication, setMedication] = useState<MedicationInUse>({
    nome: '',
    dosagem: '',
    frequencia: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    instrucoes: '',
    status: 'ativo',
    prescritoPor: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(medication);
    setMedication({
      nome: '',
      dosagem: '',
      frequencia: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
      instrucoes: '',
      status: 'ativo',
      prescritoPor: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Medicamento em Uso</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Medicamento
              </label>
              <input
                type="text"
                name="nome"
                value={medication.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Atorvastatina"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosagem
              </label>
              <input
                type="text"
                name="dosagem"
                value={medication.dosagem}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: 20mg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência
              </label>
              <input
                type="text"
                name="frequencia"
                value={medication.frequencia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: 1x ao dia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                name="dataInicio"
                value={medication.dataInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                name="dataFim"
                value={medication.dataFim}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Deixe em branco para uso contínuo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescrito por
              </label>
              <input
                type="text"
                name="prescritoPor"
                value={medication.prescritoPor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Dr. Carlos Santos"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruções de Uso
            </label>
            <textarea
              name="instrucoes"
              value={medication.instrucoes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Tomar 1 comprimido à noite"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationInUseModal; 