'use client';

import type { ChangeEvent } from 'react';

import {
  getFieldErrors,
  isFieldInvalid,
} from '@openhome-os/core/helpers/tanstack/forms/utils';
import type { WizardForm } from '@openhome-os/core/wizard/wizard-types';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@openhome-os/ui/field';
import type { AnyFieldApi } from '@tanstack/react-form';

import type { HomeFormValues } from '../_constants/home-registration-constants';

interface HomeItemRegistrationDetailsStepProps {
  form: WizardForm<HomeFormValues>;
}

function OptionalLabel() {
  return <span className="text-muted-foreground text-xs">Optional</span>;
}

export function HomeItemRegistrationDetailsStep({
  form,
}: HomeItemRegistrationDetailsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="model_number">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Model Number <OptionalLabel />
              </FieldLabel>
              <FieldControl
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(event.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="Item model number"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="warranty_expiration">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Warranty Expiration <OptionalLabel />
              </FieldLabel>
              <FieldControl
                type="date"
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(event.target.value)
                }
                onBlur={field.handleBlur}
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
}
