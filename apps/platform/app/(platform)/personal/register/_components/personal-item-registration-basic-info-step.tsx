'use client';

import { isFieldInvalid } from '@openhome-os/core/helpers/tanstack/forms/utils';
import { BasicInfoStepSchema } from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardForm } from '@openhome-os/core/wizard/wizard-types';
import { Field, FieldControl, FieldLabel } from '@openhome-os/ui/field';
import { Textarea } from '@openhome-os/ui/textarea';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { z } from 'zod';

type BasicInfoFields = z.infer<typeof BasicInfoStepSchema>;

interface BasicInfoStepProps<TFormData extends BasicInfoFields> {
  form: WizardForm<TFormData>;
}

export function BasicInfoStep<TFormData extends BasicInfoFields>({
  form,
}: BasicInfoStepProps<TFormData>) {
  return (
    <div className="flex flex-col gap-4">
      <form.Field name="name">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Name</FieldLabel>
            <FieldControl
              value={field.state.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Item name"
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="description">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Description</FieldLabel>
            <FieldControl
              render={
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Brief description"
                  className="bg-transparent"
                />
              }
            />
          </Field>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="brand">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Brand</FieldLabel>
              <FieldControl
                value={field.state.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="Brand name"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="base_color">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Color</FieldLabel>
              <FieldControl
                value={field.state.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="Primary color"
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="notes">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Notes</FieldLabel>
            <FieldControl
              render={
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Any additional notes"
                  rows={2}
                  className="bg-transparent"
                />
              }
            />
          </Field>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="purchase_price">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Purchase Price</FieldLabel>
              <FieldControl
                type="number"
                step="0.01"
                min="0"
                value={field.state.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                onBlur={field.handleBlur}
                placeholder="0.00"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="purchase_date">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Purchase Date</FieldLabel>
              <FieldControl
                type="date"
                value={field.state.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                onBlur={field.handleBlur}
              />
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
}
