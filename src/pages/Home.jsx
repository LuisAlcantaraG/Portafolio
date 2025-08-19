import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import HeaderNavigation from '../components/ui/HeaderNavigation';
import BreadcrumbTrail from '../components/ui/BreadcrumbTrail';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import data from '../utils/materiales.json';
import { getStoredTransactions, addTransaction, initializeDefaultTransactions } from '../utils/transactionStorage';

const Home = () => {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    classification: '',
    materialName: '',
    quantity: '',
    transactionType: 'entrada'
  });

  const [transactions, setTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const storedTransactions = initializeDefaultTransactions();
    setTransactions(storedTransactions);
  }, []);

  // Transaction type options
  const transactionTypeOptions = [
    { value: 'entrada', label: 'Entrada' },
    { value: 'salida', label: 'Salida' }
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  const categorias = Object.keys(data);

  const materialesFiltrados = categoriaSeleccionada === "Todas"
    ? Object.entries(data).flatMap(([_, items]) => items)
    : data[categoriaSeleccionada] || [];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.classification) {
      newErrors.classification = 'Clasificación es requerida';
    }

    if (!formData?.materialName?.trim()) {
      newErrors.materialName = 'Nombre del material es requerido';
    }

    if (!formData?.quantity || isNaN(formData?.quantity) || Number(formData?.quantity) <= 0) {
      newErrors.quantity = 'Cantidad debe ser un número mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new transaction data
      const transactionData = {
        date: formData?.date,
        classification: formData?.classification,
        material: formData?.materialName,
        quantity: Number(formData?.quantity),
        type: formData?.transactionType
      };

      // Add transaction to localStorage and get the saved transaction
      const savedTransaction = addTransaction(transactionData);

      if (savedTransaction) {
        // Update local state with all stored transactions
        const updatedTransactions = getStoredTransactions();
        setTransactions(updatedTransactions);

        // Reset form
        setFormData({
          date: format(new Date(), 'yyyy-MM-dd'),
          classification: '',
          materialName: '',
          quantity: '',
          transactionType: 'entrada'
        });

        console.log('Transacción guardada permanentemente:', savedTransaction);
      } else {
        throw new Error('Error al guardar la transacción');
      }
    } catch (error) {
      console.error('Error al registrar transacción:', error);
      // You could add a toast notification here for better UX
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransactionTypeIcon = (type) => {
    return type === 'entrada' ? 'ArrowUp' : 'ArrowDown';
  };

  const getTransactionTypeColor = (type) => {
    return type === 'entrada' ? 'text-green-600' : 'text-red-600';
  };

  const getClassificationColor = (classification) => {
    const colors = {
      bodega: 'bg-blue-100 text-blue-800',
      solventes: 'bg-yellow-100 text-yellow-800',
      poliuretano: 'bg-purple-100 text-purple-800'
    };
    return colors?.[classification] || 'bg-gray-100 text-gray-800';
  };

  // Update date to current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFormData(prev => ({
        ...prev,
        date: format(new Date(), 'yyyy-MM-dd')
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <BreadcrumbTrail />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Registro de Inventario
            </h1>
            <p className="text-muted-foreground">
              Llena el formulario segun corresponda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <Icon name="Plus" size={16} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Nuevo Registro
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="date"
                  label="Fecha"
                  value={formData?.date}
                  onChange={(e) => handleInputChange('date', e?.target?.value)}
                  required
                />

                <Select
                  label="Categoría"
                  placeholder="Selecciona una categoría"
                  options={categorias.map((cat) => ({ value: cat, label: cat }))}
                  value={categoriaSeleccionada}
                  onChange={(value) => {
                    setCategoriaSeleccionada(value);
                    handleInputChange("classification", value); // guarda la categoría en formData
                  }}
                  required
                  error={errors?.classification}
                />

                {/* Selección de Material */}
                <Select
                  label="Nombre del Material"
                  placeholder="Selecciona el material"
                  options={materialesFiltrados.map((mat) => ({
                    value: mat.nombre,
                    label: mat.nombre
                  }))}
                  value={formData?.materialName}
                  onChange={(value) => handleInputChange("materialName", value)}
                  required
                  error={errors?.materialName}
                />

                <Input
                  type="number"
                  label="Cantidad"
                  placeholder="Ej: 100"
                  value={formData?.quantity}
                  onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                  min="1"
                  step="0.01"
                  required
                  error={errors?.quantity}
                />

                <Select
                  label="Estatus de ingreso"
                  options={transactionTypeOptions}
                  value={formData?.transactionType}
                  onChange={(value) => handleInputChange('transactionType', value)}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  iconName="Save"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Movimiento'}
                </Button>
              </form>
            </div>

            {/* Real-time Transaction Log */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Icon name="Activity" size={16} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Registros Guardados
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {transactions?.length} movimientos permanentes
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions?.length > 0 ? (
                  transactions?.map((transaction) => (
                    <div
                      key={transaction?.id}
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${transaction?.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon
                          name={getTransactionTypeIcon(transaction?.type)}
                          size={14}
                          className={getTransactionTypeColor(transaction?.type)}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-foreground truncate">
                            {transaction?.material}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClassificationColor(transaction?.classification)}`}>
                            {transaction?.classification?.charAt(0)?.toUpperCase() + transaction?.classification?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {transaction?.type === 'entrada' ? '+' : '-'}{transaction?.quantity} unidades
                          </span>
                          <span>
                            {format(new Date(transaction?.timestamp), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
                      <Icon name="Package" size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No hay movimientos guardados
                    </h3>
                    <p className="text-muted-foreground">
                      Los nuevos registros se guardarán permanentemente
                    </p>
                  </div>
                )}
              </div>

              {transactions?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BarChart3"
                    onClick={() => window.location.href = '/transaction-history-dashboard'}
                  >
                    Ver Historial Completo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;