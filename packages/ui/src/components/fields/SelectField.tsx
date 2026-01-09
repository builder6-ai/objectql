import React from 'react';
import { FieldWrapper } from './FieldWrapper';
import { Select } from '../Select';

interface SelectFieldProps {
  name: string;
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  readonly,
  options = [],
  placeholder = "Select an option..."
}: SelectFieldProps) {
  return (
    <FieldWrapper id={name} label={label} error={error} required={required}>
      {readonly ? (
        <div className="flex h-10 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          {options.find(opt => opt.value === value)?.label || value || '-'}
        </div>
      ) : (
        <Select
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          options={options}
        />
      )}
    </FieldWrapper>
  );
}
