import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionStats = ({ transactions }) => {
  const calculateStats = () => {
    const totalTransactions = transactions?.length;
    const totalEntries = transactions?.filter(t => t?.type === 'entrada')?.length;
    const totalExits = transactions?.filter(t => t?.type === 'salida')?.length;
    
    const classificationStats = transactions?.reduce((acc, transaction) => {
      if (!acc?.[transaction?.classification]) {
        acc[transaction.classification] = { entries: 0, exits: 0 };
      }
      if (transaction?.type === 'entrada') {
        acc[transaction.classification].entries++;
      } else {
        acc[transaction.classification].exits++;
      }
      return acc;
    }, {});

    return {
      totalTransactions,
      totalEntries,
      totalExits,
      classificationStats
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Transacciones',
      value: stats?.totalTransactions,
      icon: 'Activity',
      color: 'text-primary bg-primary/10'
    },
    {
      title: 'Entradas',
      value: stats?.totalEntries,
      icon: 'ArrowUp',
      color: 'text-success bg-success/10'
    },
    {
      title: 'Salidas',
      value: stats?.totalExits,
      icon: 'ArrowDown',
      color: 'text-destructive bg-destructive/10'
    }
  ];

  const getClassificationIcon = (classification) => {
    const icons = {
      'bodega': 'Package',
      'solventes': 'Beaker',
      'poliuretano': 'Droplets'
    };
    return icons?.[classification] || 'Box';
  };

  const getClassificationColor = (classification) => {
    const colors = {
      'bodega': 'text-blue-600 bg-blue-50',
      'solventes': 'text-orange-600 bg-orange-50',
      'poliuretano': 'text-purple-600 bg-purple-50'
    };
    return colors?.[classification] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Main Stats */}
      {statCards?.map((stat) => (
        <div key={stat?.title} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-md ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.title}</p>
            </div>
          </div>
        </div>
      ))}
      {/* Classification Stats */}
      {Object.entries(stats?.classificationStats)?.map(([classification, data]) => (
        <div key={classification} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-md ${getClassificationColor(classification)}`}>
              <Icon name={getClassificationIcon(classification)} size={16} />
            </div>
            <h3 className="text-sm font-medium text-foreground capitalize">
              {classification}
            </h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-success">Entradas:</span>
              <span className="text-xs font-medium text-foreground">{data?.entries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-destructive">Salidas:</span>
              <span className="text-xs font-medium text-foreground">{data?.exits}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionStats;