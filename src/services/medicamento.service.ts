import api from './api';

export interface Medicamento {
  id: string;
  nomeComercial: string;
  nomeGenerico: string;
  codigoInterno: string;
  apresentacao: string;
  formaFarmaceutica: string;
  dosagem: string;
  unidadeMedida: string;
  registroAnvisa: string;
  lote: string;
  dataFabricacao: string;
  dataValidade: string;
  quantidadeEstoque: number;
  quantidadeMinima: number;
  localArmazenamento: string;
  condicoesArmazenamento: string;
  tipoControle: string;
  classificacaoTerapeutica: string;
  necessitaPrescricao: boolean;
  restricoesUso?: string;
  indicacoes?: string;
  contraIndicacoes?: string;
  efeitosColaterais?: string;
  posologiaPadrao?: string;
  observacoes?: string;
  fabricanteId: string;
  fabricante: {
    id: string;
    nome: string;
    registroAnvisa: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const medicamentoService = {
  getAll: async () => {
    try {
      const response = await api.get<Medicamento[]>('/medicamentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Medicamento>(`/medicamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar medicamento:', error);
      throw error;
    }
  },

  create: async (medicamento: Omit<Medicamento, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post<Medicamento>('/medicamentos', medicamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar medicamento:', error);
      throw error;
    }
  },

  update: async (id: string, medicamento: Partial<Medicamento>) => {
    try {
      const response = await api.put<Medicamento>(`/medicamentos/${id}`, medicamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/medicamentos/${id}`);
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
      throw error;
    }
  }
}; 