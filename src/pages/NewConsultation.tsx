import React, { useState } from 'react';
import { 
  ArrowLeft,
  FilePlus,
  FileText,
  Printer,
  Save,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const NewConsultation = () => {
  const [activeTab, setActiveTab] = useState<'consultation' | 'prescription' | 'certificate'>('consultation');

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/records"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Nova Consulta</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Finalizar Consulta
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('consultation')}
                className={`${
                  activeTab === 'consultation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Consulta
              </button>
              <button
                onClick={() => setActiveTab('prescription')}
                className={`${
                  activeTab === 'prescription'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Receita Médica
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`${
                  activeTab === 'certificate'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Atestado Médico
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'consultation' && (
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Paciente</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome do Paciente</label>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        <option>Selecione um paciente</option>
                        <option>Maria Silva</option>
                        <option>João Santos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data da Consulta</label>
                      <input
                        type="datetime-local"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sinais Vitais</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pressão Arterial</label>
                      <input
                        type="text"
                        placeholder="120/80"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frequência Cardíaca</label>
                      <input
                        type="number"
                        placeholder="BPM"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Temperatura</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="°C"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Freq. Respiratória</label>
                      <input
                        type="number"
                        placeholder="rpm"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Saturação O2</label>
                      <input
                        type="number"
                        placeholder="%"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms and Diagnosis */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sintomas e Diagnóstico</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sintomas</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Descreva os sintomas do paciente"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Registre o diagnóstico"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Observações Adicionais</h3>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Adicione observações relevantes"
                  />
                </div>
              </div>
            )}

            {activeTab === 'prescription' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Receita
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Medicamento</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Nome do medicamento"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dosagem</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Ex: 1 comprimido"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Frequência</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500  sm:text-sm"
                            placeholder="Ex: 8 em 8 horas"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duração</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Ex: 7 dias"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Instruções</label>
                        <textarea
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Instruções específicas para este medicamento"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FilePlus className="w-4 h-4 mr-2" />
                    Adicionar Medicamento
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Orientações Gerais</h3>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Adicione orientações gerais para o paciente"
                  />
                </div>
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Atestado
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Atestado Médico</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo de Atestado</label>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        <option>Selecione o tipo</option>
                        <option>Atestado de Comparecimento</option>
                        <option>Atestado de Afastamento</option>
                        <option>Atestado de Aptidão Física</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Término</label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">CID (opcional)</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Código CID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Descreva o motivo do atestado"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConsultation;