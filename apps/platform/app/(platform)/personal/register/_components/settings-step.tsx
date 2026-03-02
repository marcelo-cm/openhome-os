'use client';

import { string } from '@openhome-os/core/formatters';
import {
  getFieldErrors,
  isFieldInvalid,
} from '@openhome-os/core/helpers/tanstack/forms/utils';
import {
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';
import { SettingsStepSchema } from '@openhome-os/core/models/item/item-registration-schemas';
import useLocationsQuery from '@openhome-os/core/models/location/hooks/use-locations-query';
import type { WizardForm } from '@openhome-os/core/wizard/wizard-types';
import { Field, FieldError, FieldLabel } from '@openhome-os/ui/field';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@openhome-os/ui/select';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { z } from 'zod';

type SettingsFields = z.infer<typeof SettingsStepSchema>;

interface SettingsStepProps<TFormData extends SettingsFields> {
  form: WizardForm<TFormData>;
}

const STATUS_OPTIONS = Object.values(ItemStatus);
const PRIVACY_OPTIONS = Object.values(ItemPrivacy);

export function SettingsStep<TFormData extends SettingsFields>({
  form,
}: SettingsStepProps<TFormData>) {
  const { data: locations = [] } = useLocationsQuery({
    queryKey: ['locations'],
  });

  return (
    <div className="flex flex-col gap-4">
      <form.Field name="location_id">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Location *</FieldLabel>
            <Select
              value={field.state.value ?? ''}
              onValueChange={(val: string) => field.handleChange(val)}
            >
              <SelectTrigger>
                <SelectValue>Select a location</SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <FieldError>{getFieldErrors(field)}</FieldError>
          </Field>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="status">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={field.state.value ?? ItemStatus.ACTIVE}
                onValueChange={(val: string) => field.handleChange(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {string.titleCase(status)}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="privacy">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>Privacy</FieldLabel>
              <Select
                value={field.state.value ?? ItemPrivacy.PRIVATE}
                onValueChange={(val: string) => field.handleChange(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {PRIVACY_OPTIONS.map((privacy) => (
                    <SelectItem key={privacy} value={privacy}>
                      {string.titleCase(privacy)}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
}
