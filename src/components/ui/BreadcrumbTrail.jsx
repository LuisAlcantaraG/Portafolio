import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = () => {
  const location = useLocation();

  const pathLabels = {
    '/': 'Inicio',
    '/transacciones': 'Transacciones',
    '/transaction-history-dashboard': 'Historial',
    '/exportar': 'Exportar'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Inicio', path: '/' }];

    let currentPath = '';
    pathSegments?.forEach(segment => {
      currentPath += `/${segment}`;
      const label = pathLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
      breadcrumbs?.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb?.path}>
          {index === breadcrumbs?.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">
              {breadcrumb?.label}
            </span>
          ) : (
            <>
              <Link
                to={breadcrumb?.path}
                className="hover:text-foreground transition-smooth"
              >
                {breadcrumb?.label}
              </Link>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbTrail;