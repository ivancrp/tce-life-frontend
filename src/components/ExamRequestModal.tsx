import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { attendanceService } from '../services/attendance.service';

interface ExamRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceId: string;
  onExamRequested: () => void;
}

export const ExamRequestModal: React.FC<ExamRequestModalProps> = ({
  isOpen,
  onClose,
  attendanceId,
  onExamRequested
}) => {
  const [examType, setExamType] = useState('');
  const [laboratory, setLaboratory] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examType) {
      toast.error('Por favor, selecione o tipo de exame');
      return;
    }

    try {
      setIsLoading(true);
      await attendanceService.requestMedicalExam({
        attendanceId,
        examType,
        laboratory,
        observations,
        status: 'pending',
        requestDate: new Date().toISOString()
      });

      toast.success('Exame solicitado com sucesso!');
      onExamRequested();
      onClose();
    } catch (error) {
      console.error('Erro ao solicitar exame:', error);
      toast.error('Erro ao solicitar exame. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Solicitar Exame</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Exame*
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecione um tipo de exame</option>
              <option value="Hemograma Completo">Hemograma Completo</option>
              <option value="Exame de Sangue">Exame de Sangue</option>
              <option value="Raio X">Raio X</option>
              <option value="Ultrassonografia">Ultrassonografia</option>
              <option value="Ressonância Magnética">Ressonância Magnética</option>
              <option value="Tomografia">Tomografia</option>
              <option value="Eletrocardiograma">Eletrocardiograma</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Laboratório/Clínica Sugerido
            </label>
            <input
              type="text"
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Nome do laboratório ou clínica"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Observações adicionais sobre o exame"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Solicitando...' : 'Solicitar Exame'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 