import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  doctorName: string;
  attendanceDate: Date;
  attendanceTime: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  patientName,
  doctorName,
  attendanceDate,
  attendanceTime
}) => {
  const [daysOff, setDaysOff] = useState('1');
  const [cid, setCid] = useState('');

  const handlePrint = () => {
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
      text-align: center; /* Centraliza o texto dentro da div */
    }
    .assinatura-medica p {
      margin: 5px 0;
    }
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
          <p>Atesto que atendi nesta data o(a) Sr(a) ${patientName} às ${attendanceTime}, sendo necessário seu afastamento do local de trabalho ou escola por ${daysOff} dia(s), a partir de ${format(attendanceDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, tendo como causa do atendimento o código abaixo:</p>

          <p><strong>${cid || '...........................'}</strong><br>
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
          <p>Assinatura médica </p>
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerar Atestado Médico</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

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
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Atestado
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal; 