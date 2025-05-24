import React from 'react';
import { 
  User,
  Lock,
  Bell,
  Shield,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
  console.log('Settings iniciado');
  const navigate = useNavigate();

  const settingsSections = [
    {
      id: 'profile',
      title: 'Perfil',
      icon: User,
      description: 'Atualize suas informações pessoais e especialidades',
      link: '/settings/user-specialty'
    },
    {
      id: 'specialties',
      title: 'Especialidades',
      icon: Stethoscope,
      description: 'Gerencie as especialidades disponíveis no sistema',
      link: '/settings/specialty'
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: Lock,
      description: 'Gerencie senha, autenticação e configurações LDAP',
      link: '/settings/ldap'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: Bell,
      description: 'Configure suas preferências de notificação'
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: Shield,
      description: 'Configure políticas de privacidade e compartilhamento'
    }
  ];

  const handleNavigation = (link: string) => {
    console.log('Navegando para:', link);
    navigate(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  to={section.link || '#'}
                  onClick={() => section.link && handleNavigation(section.link)}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="focus:outline-none">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {section.title}
                        </p>
                        {section.link && (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informações do Sistema
          </h3>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Versão</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1.0.0</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Última Atualização</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date().toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;