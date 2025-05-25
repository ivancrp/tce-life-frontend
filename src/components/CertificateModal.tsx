import React, { useState, useEffect } from 'react';
import { X, Printer, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { attendanceService, MedicalCertificate } from '../services/attendance.service';
import { toast } from 'react-hot-toast';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  doctorName: string;
  attendanceDate: Date;
  attendanceTime: string;
  attendanceId: string;
  userId: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  patientName,
  doctorName,
  attendanceDate,
  attendanceTime,
  attendanceId,
  userId
}) => {
  const [daysOff, setDaysOff] = useState('1');
  const [cid, setCid] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [existingCertificates, setExistingCertificates] = useState<MedicalCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && attendanceId) {
      loadExistingCertificates();
    }
  }, [isOpen, attendanceId]);

  const loadExistingCertificates = async () => {
    try {
      setIsLoading(true);
      const certificates = await attendanceService.getMedicalCertificatesByAttendanceId(attendanceId);
      setExistingCertificates(certificates);
    } catch (error) {
      console.error('Erro ao carregar atestados:', error);
      toast.error('Erro ao carregar atestados existentes');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async (certificate?: MedicalCertificate) => {
    try {
      setIsSaving(true);
      
      let certificateData = certificate;
      
      if (!certificate) {
        // Salvar novo atestado no banco de dados
        const startDate = new Date(attendanceDate);
        const endDate = addDays(startDate, parseInt(daysOff));
        
        certificateData = await attendanceService.saveMedicalCertificate({
          userId,
          attendanceId,
          type: 'absence',
          startDate,
          endDate,
          cid: cid || undefined,
          description: `Atestado médico de ${daysOff} dia(s) para o paciente ${patientName}`,
          daysOff: parseInt(daysOff)
        });

        // Atualizar a lista de atestados
        await loadExistingCertificates();
      }

      if (!certificateData) return;

      // Criar o conteúdo do atestado
      const certificateContent = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <title>Atestado Médico</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 50px auto;
              max-width: 700px;
              line-height: 1.6;
              color: #333;
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo img {
              max-width: 250px;
            }
            h2 {
              text-align: center;
              margin-top: 0;
            }
            .content {
              margin-top: 20px;
            }
            .assinatura {
              margin-top: 50px;
            }
            .assinatura p {
              margin: 5px 0;
            }
            .assinatura-medica {
              margin-top: 50px;
              text-align: center;
            }
            .assinatura-medica p {
              margin: 5px 0;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="/TCE_LOGO_HORIZONTAL.png" alt="Logo Tribunal de Contas do Estado do Ceará">
          </div>

          <h2>ATESTADO MÉDICO</h2>

          <div class="content">
            <p>Atesto que atendi nesta data o(a) Sr(a) ${patientName} às ${attendanceTime}, sendo necessário seu afastamento do local de trabalho ou escola por ${certificateData.daysOff} dia(s), a partir de ${format(new Date(certificateData.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, tendo como causa do atendimento o código abaixo:</p>

            <p><strong>${certificateData.cid || '...........................'}</strong><br>
            ............................<br>
            Código da Doença</p>
          </div>

          <div class="assinatura">
            <p>Fortaleza, ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            <br>
            <br>
            <br>
          </div>
          <div class="assinatura-medica">
            <p>${doctorName}</p>
            <p>Assinatura médica</p>
          </div>
        </body>
        </html>
      `;

      // Criar uma nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(certificateContent);
        printWindow.document.close();
        
        // Aguardar o carregamento da imagem antes de imprimir
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }

      if (!certificate) {
        toast.success('Atestado médico salvo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar atestado:', error);
      toast.error('Erro ao salvar atestado médico. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Atestado Médico</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : existingCertificates.length > 0 ? (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
                <p className="text-sm text-blue-700">
                  Este atendimento já possui {existingCertificates.length} atestado(s) gerado(s).
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {existingCertificates.map((certificate, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Atestado de {certificate.daysOff} dia(s)</p>
                      <p className="text-sm text-gray-600">
                        Início: {format(new Date(certificate.startDate), "dd/MM/yyyy", { locale: ptBR })}
                        {certificate.endDate && ` - Fim: ${format(new Date(certificate.endDate), "dd/MM/yyyy", { locale: ptBR })}`}
                      </p>
                      {certificate.cid && (
                        <p className="text-sm text-gray-600">CID: {certificate.cid}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handlePrint(certificate)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Reimprimir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">Deseja gerar um novo atestado?</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dias de Afastamento
            </label>
            <input
              type="number"
              min="1"
              value={daysOff}
              onChange={(e) => setDaysOff(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CID-10 (opcional)
            </label>
            <input
              type="text"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: J11"
            />
          </div>
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
            type="button"
            onClick={() => handlePrint()}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Gerar Novo Atestado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal; 