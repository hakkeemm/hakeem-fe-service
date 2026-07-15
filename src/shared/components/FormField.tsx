import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { Input, type InputProps } from './Input';

type SharedInputProps = Omit<InputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'>;

interface FormFieldProps<TFieldValues extends FieldValues>
  extends SharedInputProps {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  errorMessage?: string;
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  errorMessage,
  ...inputProps
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          {...inputProps}
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onBlur={onBlur}
          onChangeText={onChange}
          error={errorMessage}
        />
      )}
    />
  );
}
