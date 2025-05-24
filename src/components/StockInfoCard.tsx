import React from 'react';
import { AlertTriangle, Package, Clock } from 'lucide-react';

interface StockInfoCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const StockInfoCard: React.FC<StockInfoCardProps> = ({ title, value, icon, color, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface StockInfoProps {
  expiringSoon: number;
  lowStock: number;
  totalStock: number;
}

const StockInfo: React.FC<StockInfoProps> = ({ expiringSoon, lowStock, totalStock }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StockInfoCard
        title="Próximos do Vencimento"
        value={expiringSoon}
        icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
        color="text-yellow-500"
        description="Medicamentos com validade próxima"
      />
      <StockInfoCard
        title="Estoque Baixo"
        value={lowStock}
        icon={<Package className="h-6 w-6 text-red-500" />}
        color="text-red-500"
        description="Medicamentos com quantidade abaixo do mínimo"
      />
      <StockInfoCard
        title="Total em Estoque"
        value={totalStock}
        icon={<Clock className="h-6 w-6 text-blue-500" />}
        color="text-blue-500"
        description="Total de medicamentos no estoque"
      />
    </div>
  );
};

export default StockInfo; 