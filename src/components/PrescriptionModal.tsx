import React from 'react';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  doctorName: string;
  doctorCrm: string;
  prescription: string;
  attendanceDate: Date;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patientName,
  doctorName,
  doctorCrm,
  prescription,
  attendanceDate
}) => {
  const handlePrint = () => {
    const prescriptionContent = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Receita Médica</title>
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

          .prescription-content {
          
            padding: 10px;
                }
          .assinatura {
            margin-top: 50px;
            text-align: center;
          }
          .assinatura p {
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

        <h2>RECEITA MÉDICA</h2>
        <br>
          <br>
        <div class="content">
             
          <div>
              <br>
            <p><strong>Paciente:</strong> ${patientName}</p>
             <br>
              <br>
          </div>

          <div class="prescription-content">
            ${prescription}
          </div>
        </div>
         <br>
         <br>
          <br>
          <p>Fortaleza, ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        <div class="assinatura">
          <br>
          <br>
          <br>
          <p>${doctorName}</p>
      
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(prescriptionContent);
      printWindow.document.close();
      
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
          <h2 className="text-xl font-semibold">Gerar Receita Médica</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Confirme se os dados da prescrição estão corretos antes de gerar a receita.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Dados da Receita:</h3>
            <p><strong>Paciente:</strong> {patientName}</p>
            <p><strong>Médico:</strong> {doctorName}</p>
            <p><strong>CRM:</strong> {doctorCrm}</p>
            <p><strong>Data:</strong> {format(attendanceDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Prescrição:</h3>
            <div className="whitespace-pre-wrap">{prescription}</div>
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
            Imprimir Receita
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal; 