'use client';

import {
  getFieldErrors,
  isFieldInvalid,
} from '@openhome-os/core/helpers/tanstack/forms/utils';
import type { WizardForm } from '@openhome-os/core/wizard/wizard-types';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@openhome-os/ui/field';
import type { AnyFieldApi } from '@tanstack/react-form';

interface PersonalDetailsStepProps {
  form: WizardForm;
}

export function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <form.Field name="material">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Material</FieldLabel>
            <FieldControl
              value={field.state.value ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="e.g. Leather, Plastic, Metal"
            />
            <FieldError>{getFieldErrors(field)}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field name="replacement_cycle_days">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Replacement Cycle</FieldLabel>
            <FieldControl
              type="number"
              min="1"
              step="1"
              value={field.state.value ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                field.handleChange(val === '' ? undefined : Number(val));
              }}
              onBlur={field.handleBlur}
              placeholder="Days"
            />
            <FieldDescription>
              How often this item typically needs replacing (in days).
            </FieldDescription>
            <FieldError>{getFieldErrors(field)}</FieldError>
          </Field>
        )}
      </form.Field>
    </div>
  );
}
