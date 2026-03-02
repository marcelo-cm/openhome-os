import type { AnyFieldApi } from '@tanstack/react-form';

export function isFieldInvalid(field: AnyFieldApi): boolean {
  return (field.state.meta.isTouched && !field.state.meta.isValid) ?? false;
}

export function getFieldErrors(field: AnyFieldApi): string {
  return field.state.meta.errors
    .map((e: { message: string }) => e.message)
    .join(', ');
}
