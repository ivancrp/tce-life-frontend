import React, { useState } from 'react';
import { X } from 'lucide-react';
import { attendanceService } from '../services/attendance.service';
import { toast } from 'react-hot-toast';

interface RequestExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceId: string;
  userId: string;
  onExamRequested: () => void;
}

interface ExamData {
  userId: string;
  attendanceId: string;
  examType: string;
  requestDate: Date;
  laboratory?: string;
  observations?: string;
}

const RequestExamModal: React.FC<RequestExamModalProps> = ({
  isOpen,
  onClose,
  attendanceId,
  userId,
  onExamRequested
}) => {
  const [examType, setExamType] = useState('');
  const [laboratory, setLaboratory] = useState('');
  const [observations, setObservations] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examType.trim()) {
      toast.error('Por favor, informe o tipo do exame');
      return;
    }

    try {
      setIsSaving(true);
      
      const examData: ExamData = {
        userId,
        attendanceId,
        examType: examType.trim(),
        requestDate: new Date()
      };

      // Só adiciona laboratory e observations se não estiverem vazios
      if (laboratory.trim()) {
        examData.laboratory = laboratory.trim();
      }
      
      if (observations.trim()) {
        examData.observations = observations.trim();
      }

      await attendanceService.requestMedicalExam(examData);

      toast.success('Exame solicitado com sucesso!');
      onExamRequested();
      onClose();
      
      // Limpar formulário
      setExamType('');
      setLaboratory('');
      setObservations('');
    } catch (error) {
      console.error('Erro ao solicitar exame:', error);
      toast.error('Erro ao solicitar exame. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Solicitar Exame</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Exame *
            </label>
            <input
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: Hemograma Completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Laboratório (opcional)
            </label>
            <input
              type="text"
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: Laboratório Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Instruções ou observações adicionais..."
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                'Solicitar Exame'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestExamModal; 