import React, { useState } from 'react';
import { X, Plus, XCircle } from 'lucide-react';

interface AddAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allergies: string[]) => void;
}

const AddAllergyModal: React.FC<AddAllergyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  const handleAddAllergy = () => {
    if (currentAllergy.trim() && !allergies.includes(currentAllergy.trim())) {
      setAllergies([...allergies, currentAllergy.trim()]);
      setCurrentAllergy('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAllergy();
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAllergy.trim()) {
      handleAddAllergy();
    }
    if (allergies.length > 0) {
      onSave(allergies);
      setAllergies([]);
      setCurrentAllergy('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Alergias</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adicionar Alergia
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentAllergy}
                onChange={(e) => setCurrentAllergy(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Penicilina"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                disabled={!currentAllergy.trim()}
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {allergies.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alergias a serem adicionadas:
              </label>
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    <span className="text-sm">{allergy}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setAllergies([]);
                setCurrentAllergy('');
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={allergies.length === 0 && !currentAllergy.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Salvar Alergias
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAllergyModal; 