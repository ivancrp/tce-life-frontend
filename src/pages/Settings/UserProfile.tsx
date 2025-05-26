import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Save, Heart, UserCircle, FileText, MapPin, GraduationCap, Users, Lock } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import Breadcrumbs from '../../components/Breadcrumbs';

interface UserProfileData {
  id: string;
  name: string;
  nomeSocial?: string;
  email: string;
  telefone?: string;
  celular?: string;
  dateOfBirth?: string;
  gender?: string;
  naturalidade?: string;
  nomeMae?: string;
  nomePai?: string;
  estadoCivil?: string;
  escolaridade?: string;
  tipoSanguineo?: string;
  raca?: string;
  cpf?: string;
  insurance?: string;
  specialty?: string;
  profilePicture?: string;
  password?: string;
  confirmPassword?: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserData({
        id: user.id,
        name: user.name,
        nomeSocial: user.nomeSocial,
        email: user.email,
        telefone: user.telefone,
        celular: user.celular,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        naturalidade: user.naturalidade,
        nomeMae: user.nomeMae,
        nomePai: user.nomePai,
        estadoCivil: user.estadoCivil,
        escolaridade: user.escolaridade,
        tipoSanguineo: user.tipoSanguineo,
        raca: user.raca,
        cpf: user.cpf,
        insurance: user.insurance,
        specialty: user.specialty,
        profilePicture: user.profilePicture,
        password: '',
        confirmPassword: ''
      });
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    // Validar senhas se foram preenchidas
    if (userData.password && userData.confirmPassword) {
      if (userData.password !== userData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      if (userData.password.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres');
        return;
      }
    }

    try {
      setSaving(true);
      const dataToSend = { ...userData };
      if (!dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.confirmPassword;
      }
      const response = await api.put(`/users/${userData.id}`, dataToSend);
      setUserData(prev => ({
        ...response.data,
        password: '',
        confirmPassword: ''
      }));
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const inputBaseClasses = "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400";
  const selectBaseClasses = "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";
  const iconBaseClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200";

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Perfil</h1>
          <p className="mt-2 text-sm text-gray-600">
            Atualize suas informações pessoais e configurações da conta
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Foto do Perfil */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <label className={labelBaseClasses}>Foto</label>
                  <div className="mt-2 flex flex-col items-center">
                    {userData?.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt="Foto de perfil"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircle className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="mt-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Alterar foto
                    </button>
                  </div>
                </div>
              </div>

              {/* Informações Básicas */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Nome */}
                  <div className="relative group">
                    <label htmlFor="name" className={labelBaseClasses}>
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className={iconBaseClasses} />
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userData?.name || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Nome Social */}
                  <div className="relative group">
                    <label htmlFor="nomeSocial" className={labelBaseClasses}>
                      Nome Social
                    </label>
                    <div className="relative">
                      <User className={iconBaseClasses} />
                      <input
                        type="text"
                        name="nomeSocial"
                        id="nomeSocial"
                        value={userData?.nomeSocial || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="relative group">
                    <label htmlFor="cpf" className={labelBaseClasses}>
                      CPF
                    </label>
                    <div className="relative">
                      <FileText className={iconBaseClasses} />
                      <InputMask
                        mask="999.999.999-99"
                        type="text"
                        name="cpf"
                        id="cpf"
                        value={userData?.cpf || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <label htmlFor="email" className={labelBaseClasses}>
                      Email
                    </label>
                    <div className="relative">
                      <Mail className={iconBaseClasses} />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={userData?.email || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="relative group">
                    <label htmlFor="password" className={labelBaseClasses}>
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className={iconBaseClasses} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={userData?.password || ''}
                        onChange={handleInputChange}
                        placeholder="Digite para alterar a senha"
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="relative group">
                    <label htmlFor="confirmPassword" className={labelBaseClasses}>
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className={iconBaseClasses} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={userData?.confirmPassword || ''}
                        onChange={handleInputChange}
                        placeholder="Confirme a nova senha"
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="relative group">
                    <label htmlFor="telefone" className={labelBaseClasses}>
                      Telefone Fixo
                    </label>
                    <div className="relative">
                      <Phone className={iconBaseClasses} />
                      <InputMask
                        mask="(99) 9999-9999"
                        type="text"
                        name="telefone"
                        id="telefone"
                        value={userData?.telefone || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Celular */}
                  <div className="relative group">
                    <label htmlFor="celular" className={labelBaseClasses}>
                      Celular
                    </label>
                    <div className="relative">
                      <Phone className={iconBaseClasses} />
                      <InputMask
                        mask="(99) 99999-9999"
                        type="text"
                        name="celular"
                        id="celular"
                        value={userData?.celular || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Data de Nascimento */}
                  <div className="relative group">
                    <label htmlFor="dateOfBirth" className={labelBaseClasses}>
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <Calendar className={iconBaseClasses} />
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={userData?.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Complementares */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Complementares</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Gênero */}
                  <div className="relative group">
                    <label htmlFor="gender" className={labelBaseClasses}>
                      Gênero
                    </label>
                    <div className="relative">
                      <User className={iconBaseClasses} />
                      <select
                        name="gender"
                        id="gender"
                        value={userData?.gender || ''}
                        onChange={handleInputChange}
                        className={selectBaseClasses}
                      >
                        <option value="">Selecione...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                  </div>

                  {/* Naturalidade */}
                  <div className="relative group">
                    <label htmlFor="naturalidade" className={labelBaseClasses}>
                      Naturalidade
                    </label>
                    <div className="relative">
                      <MapPin className={iconBaseClasses} />
                      <input
                        type="text"
                        name="naturalidade"
                        id="naturalidade"
                        value={userData?.naturalidade || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Nome da Mãe */}
                  <div className="relative group">
                    <label htmlFor="nomeMae" className={labelBaseClasses}>
                      Nome da Mãe
                    </label>
                    <div className="relative">
                      <Users className={iconBaseClasses} />
                      <input
                        type="text"
                        name="nomeMae"
                        id="nomeMae"
                        value={userData?.nomeMae || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Nome do Pai */}
                  <div className="relative group">
                    <label htmlFor="nomePai" className={labelBaseClasses}>
                      Nome do Pai
                    </label>
                    <div className="relative">
                      <Users className={iconBaseClasses} />
                      <input
                        type="text"
                        name="nomePai"
                        id="nomePai"
                        value={userData?.nomePai || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Estado Civil */}
                  <div className="relative group">
                    <label htmlFor="estadoCivil" className={labelBaseClasses}>
                      Estado Civil
                    </label>
                    <div className="relative">
                      <Users className={iconBaseClasses} />
                      <select
                        name="estadoCivil"
                        id="estadoCivil"
                        value={userData?.estadoCivil || ''}
                        onChange={handleInputChange}
                        className={selectBaseClasses}
                      >
                        <option value="">Selecione...</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viuvo">Viúvo(a)</option>
                        <option value="separado">Separado(a)</option>
                      </select>
                    </div>
                  </div>

                  {/* Escolaridade */}
                  <div className="relative group">
                    <label htmlFor="escolaridade" className={labelBaseClasses}>
                      Escolaridade
                    </label>
                    <div className="relative">
                      <GraduationCap className={iconBaseClasses} />
                      <select
                        name="escolaridade"
                        id="escolaridade"
                        value={userData?.escolaridade || ''}
                        onChange={handleInputChange}
                        className={selectBaseClasses}
                      >
                        <option value="">Selecione...</option>
                        <option value="fundamental_incompleto">Fundamental Incompleto</option>
                        <option value="fundamental_completo">Fundamental Completo</option>
                        <option value="medio_incompleto">Médio Incompleto</option>
                        <option value="medio_completo">Médio Completo</option>
                        <option value="superior_incompleto">Superior Incompleto</option>
                        <option value="superior_completo">Superior Completo</option>
                        <option value="pos_graduacao">Pós-graduação</option>
                        <option value="mestrado">Mestrado</option>
                        <option value="doutorado">Doutorado</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações de Saúde */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Saúde</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Tipo Sanguíneo */}
                  <div className="relative group">
                    <label htmlFor="tipoSanguineo" className={labelBaseClasses}>
                      Tipo Sanguíneo
                    </label>
                    <div className="relative">
                      <Heart className={iconBaseClasses} />
                      <select
                        name="tipoSanguineo"
                        id="tipoSanguineo"
                        value={userData?.tipoSanguineo || ''}
                        onChange={handleInputChange}
                        className={selectBaseClasses}
                      >
                        <option value="">Selecione...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  {/* Raça/Cor */}
                  <div className="relative group">
                    <label htmlFor="raca" className={labelBaseClasses}>
                      Raça/Cor
                    </label>
                    <div className="relative">
                      <User className={iconBaseClasses} />
                      <select
                        name="raca"
                        id="raca"
                        value={userData?.raca || ''}
                        onChange={handleInputChange}
                        className={selectBaseClasses}
                      >
                        <option value="">Selecione...</option>
                        <option value="branca">Branca</option>
                        <option value="preta">Preta</option>
                        <option value="parda">Parda</option>
                        <option value="amarela">Amarela</option>
                        <option value="indigena">Indígena</option>
                      </select>
                    </div>
                  </div>

                  {/* Plano de Saúde */}
                  <div className="relative group">
                    <label htmlFor="insurance" className={labelBaseClasses}>
                      Plano de Saúde
                    </label>
                    <div className="relative">
                      <FileText className={iconBaseClasses} />
                      <input
                        type="text"
                        name="insurance"
                        id="insurance"
                        value={userData?.insurance || ''}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  {/* Especialidade (apenas para médicos) */}
                  {userData?.specialty !== undefined && (
                    <div className="relative group">
                      <label htmlFor="specialty" className={labelBaseClasses}>
                        Especialidade
                      </label>
                      <div className="relative">
                        <FileText className={iconBaseClasses} />
                        <input
                          type="text"
                          name="specialty"
                          id="specialty"
                          value={userData?.specialty || ''}
                          onChange={handleInputChange}
                          className={inputBaseClasses}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 