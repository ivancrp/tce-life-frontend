import React, { useState } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';

interface LDAPConfig {
  server: string;
  port: string;
  baseDN: string;
  username: string;
  password: string;
  searchFilter: string;
  attributes: string[];
}

export default function LDAPConfig() {
  const [config, setConfig] = useState<LDAPConfig>({
    server: '',
    port: '389',
    baseDN: '',
    username: '',
    password: '',
    searchFilter: '',
    attributes: ['cn', 'mail', 'uid'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implemente a lógica para salvar a configuração LDAP
    console.log('Salvando configuração LDAP:', config);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Configuração LDAP</h1>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                      Servidor LDAP
                    </label>
                    <input
                      type="text"
                      name="server"
                      id="server"
                      value={config.server}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                      Porta
                    </label>
                    <input
                      type="text"
                      name="port"
                      id="port"
                      value={config.port}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="baseDN" className="block text-sm font-medium text-gray-700">
                      Base DN
                    </label>
                    <input
                      type="text"
                      name="baseDN"
                      id="baseDN"
                      value={config.baseDN}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Usuário
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={config.username}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={config.password}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700">
                      Filtro de Busca
                    </label>
                    <input
                      type="text"
                      name="searchFilter"
                      id="searchFilter"
                      value={config.searchFilter}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="attributes" className="block text-sm font-medium text-gray-700">
                      Atributos
                    </label>
                    <input
                      type="text"
                      name="attributes"
                      id="attributes"
                      value={config.attributes.join(', ')}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        attributes: e.target.value.split(',').map(attr => attr.trim()),
                      }))}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Separe os atributos por vírgula
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Salvar Configuração
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 