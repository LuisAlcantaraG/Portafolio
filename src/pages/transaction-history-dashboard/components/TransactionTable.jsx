import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionTable = ({ transactions, onSort, sortConfig }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(transactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions?.slice(startIndex, endIndex);

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeColor = (type) => {
    return type === 'entrada' ?'text-success bg-success/10' :'text-destructive bg-destructive/10';
  };

  const getClassificationColor = (classification) => {
    const colors = {
      'bodega': 'text-blue-600 bg-blue-50',
      'solventes': 'text-orange-600 bg-orange-50',
      'poliuretano': 'text-purple-600 bg-purple-50'
    };
    return colors?.[classification] || 'text-muted-foreground bg-muted';
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Fecha</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('classification')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Clasificación</span>
                  {getSortIcon('classification')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('material')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Material</span>
                  {getSortIcon('material')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Cantidad</span>
                  {getSortIcon('quantity')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Tipo</span>
                  {getSortIcon('type')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Hora</span>
                  {getSortIcon('timestamp')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions?.map((transaction, index) => (
              <tr 
                key={transaction?.id}
                className={`border-b border-border hover:bg-muted/30 transition-smooth ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                }`}
              >
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(transaction?.date)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getClassificationColor(transaction?.classification)}`}>
                    {transaction?.classification?.charAt(0)?.toUpperCase() + transaction?.classification?.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">
                    {transaction?.material}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">
                    {Math.abs(transaction?.quantity)?.toLocaleString('es-ES')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getTransactionTypeColor(transaction?.type)}`}>
                    {transaction?.type === 'entrada' ? 'Entrada' : 'Salida'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatTime(transaction?.timestamp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        {currentTransactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getClassificationColor(transaction?.classification)}`}>
                  {transaction?.classification?.charAt(0)?.toUpperCase() + transaction?.classification?.slice(1)}
                </span>
                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getTransactionTypeColor(transaction?.type)}`}>
                  {transaction?.type === 'entrada' ? 'Entrada' : 'Salida'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(transaction?.date)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Material:</span>
                <span className="text-sm text-foreground">{transaction?.material}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Cantidad:</span>
                <span className="text-sm font-medium text-foreground">
                  {Math.abs(transaction?.quantity)?.toLocaleString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Hora:</span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(transaction?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Siguiente
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;