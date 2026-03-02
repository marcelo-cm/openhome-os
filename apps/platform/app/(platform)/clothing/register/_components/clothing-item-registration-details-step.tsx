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
import { Textarea } from '@openhome-os/ui/textarea';
import type { AnyFieldApi } from '@tanstack/react-form';

import type { ClothingFormValues } from '../_constants/clothing-registration-constants';

interface ClothingItemRegistrationDetailsStepProps {
  form: WizardForm<ClothingFormValues>;
}

function OptionalLabel() {
  return <span className="text-muted-foreground text-xs">Optional</span>;
}

export function ClothingItemRegistrationDetailsStep({
  form,
}: ClothingItemRegistrationDetailsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="size">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Size <OptionalLabel />
              </FieldLabel>
              <FieldControl
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(event.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="e.g. M, 42, 10.5"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="material">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Material <OptionalLabel />
              </FieldLabel>
              <FieldControl
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(event.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="e.g. Cotton, Wool, Denim"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="care_instructions">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>
              Care Instructions <OptionalLabel />
            </FieldLabel>
            <FieldControl
              render={
                <Textarea
                  value={field.state.value ?? ''}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. Machine wash cold, do not tumble dry"
                  rows={3}
                  className="bg-transparent"
                />
              }
            />
            <FieldError>{getFieldErrors(field)}</FieldError>
          </Field>
        )}
      </form.Field>
    </div>
  );
}
