import React from 'react';
import { FieldWrapper } from './FieldWrapper';
import { Badge } from '../Badge';

interface BadgeFieldProps {
  name: string;
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: Array<{ value: string; label: string; color?: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }>;
}

export function BadgeField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  readonly,
  options = []
}: BadgeFieldProps) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <FieldWrapper id={name} label={label} error={error} required={required}>
      {readonly ? (
        <div className="flex items-center h-10">
          {selectedOption ? (
            <Badge variant={selectedOption.variant || 'default'}>
              {selectedOption.label}
            </Badge>
          ) : (
            <span className="text-stone-500 text-sm">-</span>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !disabled && onChange?.(option.value)}
              disabled={disabled}
              className={`transition-all ${
                value === option.value ? 'ring-2 ring-stone-950 ring-offset-2' : ''
              }`}
            >
              <Badge variant={option.variant || 'default'}>
                {option.label}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
