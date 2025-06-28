import React from 'react';
import { Button } from '../ui';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: LucideIcon;
  }>;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions = [],
  breadcrumbs = []
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && (
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-gray-700">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;