import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { attendanceService, MedicalExam } from '../services/attendance.service';

export interface ExamUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MedicalExam | null;
  onExamUploaded: () => void;
}

const ExamUploadModal: React.FC<ExamUploadModalProps> = ({
  isOpen,
  onClose,
  exam,
  onExamUploaded
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validar tipos de arquivo permitidos
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const invalidFiles = Array.from(files).filter(
      file => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error('Apenas arquivos PDF, JPEG e PNG são permitidos');
      e.target.value = '';
      return;
    }

    // Validar tamanho dos arquivos (5MB por arquivo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error('Cada arquivo deve ter no máximo 5MB');
      e.target.value = '';
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !selectedFiles || selectedFiles.length === 0) {
      toast.error('Por favor, selecione os arquivos do exame');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file);
      });

      await attendanceService.uploadExamFiles(exam.id, formData);
      toast.success('Arquivos do exame enviados com sucesso!');
      onExamUploaded();
      onClose();
    } catch (error) {
      console.error('Erro ao enviar arquivos:', error);
      toast.error('Erro ao enviar arquivos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Anexar Resultado do Exame</h2>
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
              Arquivos do Exame*
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full p-2 border rounded-md"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Formatos aceitos: PDF, JPEG, PNG (máx. 5MB por arquivo)
            </p>
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
              {isLoading ? 'Enviando...' : 'Enviar Arquivos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamUploadModal; 