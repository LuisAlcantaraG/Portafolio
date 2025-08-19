import React, { useState } from 'react';
import Button from './Button';


const ExportUtility = ({ 
  data = [], 
  filename = 'export', 
  onExportComplete = () => {},
  disabled = false,
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    if (!data || data?.length === 0) {
      console.warn('No data available for export');
      return;
    }

    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would use a library like xlsx
      // For now, we'll create a CSV export as a fallback
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `${filename}.csv`);
      
      onExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
      onExportComplete(false);
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data?.length === 0) return '';
    
    const headers = Object.keys(data?.[0]);
    const csvHeaders = headers?.join(',');
    
    const csvRows = data?.map(row => 
      headers?.map(header => {
        const value = row?.[header];
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value?.includes(',') || value?.includes('"'))
          ? `"${value?.replace(/"/g, '""')}"`
          : value;
      })?.join(',')
    );
    
    return [csvHeaders, ...csvRows]?.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link?.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link?.setAttribute('href', url);
      link?.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={exportToExcel}
      disabled={disabled || isExporting}
      loading={isExporting}
      iconName="Download"
      iconPosition="left"
      className={className}
    >
      {isExporting ? 'Exportando...' : 'Exportar a Excel'}
    </Button>
  );
};

export default ExportUtility;