import React, { useState, useEffect, useMemo } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import ExportUtility from '../../components/ui/ExportUtility';
import FilterToolbar from './components/FilterToolbar';
import TransactionTable from './components/TransactionTable';
import TransactionStats from './components/TransactionStats';
import Icon from '../../components/AppIcon';
import { getStoredTransactions, initializeDefaultTransactions } from '../../utils/transactionStorage';

const TransactionHistoryDashboard = () => {
  const [filters, setFilters] = useState({
    classification: '',
    material: '',
    transactionType: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const [sortConfig, setSortConfig] = useState({
    column: 'date',
    direction: 'desc'
  });

  const [transactions, setTransactions] = useState([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const storedTransactions = getStoredTransactions();
    if (storedTransactions?.length === 0) {
      // Initialize with default data if no transactions exist
      const defaultTransactions = initializeDefaultTransactions();
      setTransactions(defaultTransactions);
    } else {
      setTransactions(storedTransactions);
    }
  }, []);

  // Listen for storage changes to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTransactions = getStoredTransactions();
      setTransactions(updatedTransactions);
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Convert transactions to match expected format (with negative quantities for salida)
  const normalizedTransactions = useMemo(() => {
    return transactions?.map(transaction => ({
      ...transaction,
      quantity: transaction?.type === 'salida' ? -Math.abs(transaction?.quantity) : Math.abs(transaction?.quantity)
    }));
  }, [transactions]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = normalizedTransactions?.filter(transaction => {
      const matchesClassification = !filters?.classification || transaction?.classification === filters?.classification;
      const matchesMaterial = !filters?.material || transaction?.material?.toLowerCase()?.includes(filters?.material?.toLowerCase());
      const matchesType = !filters?.transactionType || transaction?.type === filters?.transactionType;
      const matchesSearch = !filters?.search || transaction?.material?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      
      let matchesDateRange = true;
      if (filters?.dateFrom && filters?.dateTo) {
        const transactionDate = new Date(transaction.date);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        matchesDateRange = transactionDate >= fromDate && transactionDate <= toDate;
      } else if (filters?.dateFrom) {
        const transactionDate = new Date(transaction.date);
        const fromDate = new Date(filters.dateFrom);
        matchesDateRange = transactionDate >= fromDate;
      } else if (filters?.dateTo) {
        const transactionDate = new Date(transaction.date);
        const toDate = new Date(filters.dateTo);
        matchesDateRange = transactionDate <= toDate;
      }

      return matchesClassification && matchesMaterial && matchesType && matchesSearch && matchesDateRange;
    });

    // Sort transactions
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.column];
      let bValue = b?.[sortConfig?.column];

      if (sortConfig?.column === 'date' || sortConfig?.column === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortConfig?.column === 'quantity') {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [normalizedTransactions, filters, sortConfig]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      classification: '',
      material: '',
      transactionType: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const handleSort = (column) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig?.column === column && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportComplete = (success) => {
    if (success) {
      console.log('Export completed successfully');
    } else {
      console.error('Export failed');
    }
  };

  // Prepare export data
  const exportData = filteredAndSortedTransactions?.map(transaction => ({
    'Fecha': new Date(transaction.date)?.toLocaleDateString('es-ES'),
    'Hora': new Date(transaction.timestamp)?.toLocaleTimeString('es-ES'),
    'Clasificación': transaction?.classification?.charAt(0)?.toUpperCase() + transaction?.classification?.slice(1),
    'Material': transaction?.material,
    'Cantidad': Math.abs(transaction?.quantity),
    'Tipo': transaction?.type === 'entrada' ? 'Entrada' : 'Salida'
  }));

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Historial de Registros
              </h1>
              <p className="text-muted-foreground">
                Analisis completo de los registros de la bodega
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <ExportUtility
                data={exportData}
                filename={`historial-transacciones-${new Date()?.toISOString()?.split('T')?.[0]}`}
                onExportComplete={handleExportComplete}
                disabled={filteredAndSortedTransactions?.length === 0}
                variant="default"
                size="default"
              />
            </div>
          </div>

          {/* Transaction Statistics */}
          <TransactionStats transactions={filteredAndSortedTransactions} />

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalRecords={normalizedTransactions?.length}
            filteredRecords={filteredAndSortedTransactions?.length}
          />

          {/* Transaction Table */}
          {filteredAndSortedTransactions?.length > 0 ? (
            <TransactionTable
              transactions={filteredAndSortedTransactions}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                  <Icon name="Search" size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No se encontraron transacciones
                  </h3>
                  <p className="text-muted-foreground">
                    Ajusta los filtros para ver más resultados o registra nuevas transacciones desde la página principal.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistoryDashboard;