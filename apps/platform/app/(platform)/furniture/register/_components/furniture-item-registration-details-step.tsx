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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@openhome-os/ui/select';
import type { AnyFieldApi } from '@tanstack/react-form';

import type { FurnitureFormValues } from '../_constants/furniture-registration-constants';

interface FurnitureItemRegistrationDetailsStepProps {
  form: WizardForm<FurnitureFormValues>;
}

const DIMENSION_UNIT_OPTIONS: FurnitureFormValues['dimension_unit'][] = [
  'cm',
  'in',
];

function OptionalLabel() {
  return <span className="text-muted-foreground text-xs">Optional</span>;
}

export function FurnitureItemRegistrationDetailsStep({
  form,
}: FurnitureItemRegistrationDetailsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="dimension_width">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Width <OptionalLabel />
              </FieldLabel>
              <FieldControl
                type="number"
                min="0"
                step="0.1"
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  field.handleChange(value === '' ? undefined : Number(value));
                }}
                onBlur={field.handleBlur}
                placeholder="Width"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="dimension_height">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Height <OptionalLabel />
              </FieldLabel>
              <FieldControl
                type="number"
                min="0"
                step="0.1"
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  field.handleChange(value === '' ? undefined : Number(value));
                }}
                onBlur={field.handleBlur}
                placeholder="Height"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="dimension_depth">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Depth <OptionalLabel />
              </FieldLabel>
              <FieldControl
                type="number"
                min="0"
                step="0.1"
                value={field.state.value ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  field.handleChange(value === '' ? undefined : Number(value));
                }}
                onBlur={field.handleBlur}
                placeholder="Depth"
              />
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="dimension_unit">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Unit <OptionalLabel />
              </FieldLabel>
              <Select
                value={field.state.value ?? ''}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {DIMENSION_UNIT_OPTIONS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
}
