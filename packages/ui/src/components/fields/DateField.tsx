import React from 'react';
import { FieldWrapper } from './FieldWrapper';
import { Input } from '../Input';

interface DateFieldProps {
  name: string;
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export function DateField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  readonly
}: DateFieldProps) {
  // Format value for input type="date"
  const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';

  return (
    <FieldWrapper id={name} label={label} error={error} required={required}>
      {readonly ? (
        <div className="flex h-10 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </div>
      ) : (
        <Input
          type="date"
          id={name}
          name={name}
          value={formattedValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        />
      )}
    </FieldWrapper>
  );
}
