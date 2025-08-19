import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalRecords, 
  filteredRecords 
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const classificationOptions = [
    { value: '', label: 'Todas las clasificaciones' },
    { value: 'bodega', label: 'Bodega' },
    { value: 'solventes', label: 'Solventes' },
    { value: 'poliuretano', label: 'Poliuretano' }
  ];

  const materialOptions = [
    { value: '', label: 'Todos los materiales' },
    { value: 'tornillos', label: 'Tornillos' },
    { value: 'tuercas', label: 'Tuercas' },
    { value: 'arandelas', label: 'Arandelas' },
    { value: 'acetona', label: 'Acetona' },
    { value: 'thinner', label: 'Thinner' },
    { value: 'alcohol', label: 'Alcohol Isopropílico' },
    { value: 'resina', label: 'Resina Poliuretano' },
    { value: 'catalizador', label: 'Catalizador' },
    { value: 'pigmento', label: 'Pigmento Color' }
  ];

  const transactionTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'salida', label: 'Salida' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  return (
    <>
      {/* Desktop Filter Toolbar */}
      <div className="hidden lg:block bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-48">
            <Select
              label="Clasificación"
              options={classificationOptions}
              value={filters?.classification}
              onChange={(value) => handleFilterChange('classification', value)}
              placeholder="Seleccionar clasificación"
            />
          </div>
          
          <div className="flex-1 min-w-48">
            <Select
              label="Material"
              options={materialOptions}
              value={filters?.material}
              onChange={(value) => handleFilterChange('material', value)}
              placeholder="Seleccionar material"
              searchable
            />
          </div>
          
          <div className="flex-1 min-w-48">
            <Select
              label="Estatus de ingreso"
              options={transactionTypeOptions}
              value={filters?.transactionType}
              onChange={(value) => handleFilterChange('transactionType', value)}
              placeholder="Seleccionar tipo"
            />
          </div>
          
          <div className="flex-1 min-w-48">
            <Input
              label="Fecha Desde"
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
          </div>
          
          <div className="flex-1 min-w-48">
            <Input
              label="Fecha Hasta"
              type="date"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpiar
            </Button>
          </div>
        </div>
        
        {/* Results Counter */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{filteredRecords}</span> de{' '}
            <span className="font-medium text-foreground">{totalRecords}</span> transacciones
          </p>
        </div>
      </div>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={toggleFilterPanel}
            iconName="Filter"
            iconPosition="left"
            className="flex-1 mr-4"
          >
            Filtros
          </Button>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredRecords} de {totalRecords}
          </p>
        </div>
      </div>
      {/* Mobile Filter Panel */}
      {isFilterPanelOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFilterPanel}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Select
                  label="Clasificación"
                  options={classificationOptions}
                  value={filters?.classification}
                  onChange={(value) => handleFilterChange('classification', value)}
                />
                
                <Select
                  label="Material"
                  options={materialOptions}
                  value={filters?.material}
                  onChange={(value) => handleFilterChange('material', value)}
                  searchable
                />
                
                <Select
                  label="Tipo de Transacción"
                  options={transactionTypeOptions}
                  value={filters?.transactionType}
                  onChange={(value) => handleFilterChange('transactionType', value)}
                />
                
                <Input
                  label="Fecha Desde"
                  type="date"
                  value={filters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                />
                
                <Input
                  label="Fecha Hasta"
                  type="date"
                  value={filters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                />
                
                <Input
                  label="Buscar Material"
                  type="search"
                  placeholder="Buscar por nombre..."
                  value={filters?.search}
                  onChange={(e) => handleFilterChange('search', e?.target?.value)}
                />
                
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    fullWidth
                    iconName="X"
                    iconPosition="left"
                  >
                    Limpiar Filtros
                  </Button>
                  <Button
                    variant="default"
                    onClick={toggleFilterPanel}
                    fullWidth
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterToolbar;