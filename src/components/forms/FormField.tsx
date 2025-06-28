import React from 'react';
import { Input, Badge } from '../ui';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
  disabled = false,
  className = ''
}) => {
  const displayLabel = label || name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-2">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {displayLabel}
          </label>
        )}
        {required && (
          <Badge variant="error" size="sm">Required</Badge>
        )}
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        icon={icon}
        disabled={disabled}
      />
    </div>
  );
};

export default FormField;