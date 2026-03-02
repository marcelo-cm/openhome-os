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

interface SettingsFields {
  location_id: string;
  status?: ItemStatus;
  privacy?: ItemPrivacy;
}

interface ItemRegistrationSettingsStepProps<TFormData extends SettingsFields> {
  form: WizardForm<TFormData>;
}

const STATUS_OPTIONS = Object.values(ItemStatus);
const PRIVACY_OPTIONS = Object.values(ItemPrivacy);

function OptionalLabel() {
  return <span className="text-muted-foreground text-xs">Optional</span>;
}

export function ItemRegistrationSettingsStep<TFormData extends SettingsFields>({
  form,
}: ItemRegistrationSettingsStepProps<TFormData>) {
  const { data: locations = [] } = useLocationsQuery({
    queryKey: ['locations'],
  });

  return (
    <div className="flex flex-col gap-4">
      <form.Field name="location_id">
        {(field: AnyFieldApi) => (
          <Field invalid={isFieldInvalid(field)}>
            <FieldLabel>Location</FieldLabel>
            <Select
              value={field.state.value ?? ''}
              onValueChange={(value: string) => field.handleChange(value)}
            >
              <SelectTrigger className="bg-transparent">
                <SelectValue />
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
              <FieldLabel>
                Status <OptionalLabel />
              </FieldLabel>
              <Select
                value={field.state.value ?? ItemStatus.ACTIVE}
                onValueChange={(value: string) => field.handleChange(value)}
              >
                <SelectTrigger className="bg-transparent">
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
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="privacy">
          {(field: AnyFieldApi) => (
            <Field invalid={isFieldInvalid(field)}>
              <FieldLabel>
                Privacy <OptionalLabel />
              </FieldLabel>
              <Select
                value={field.state.value ?? ItemPrivacy.PRIVATE}
                onValueChange={(value: string) => field.handleChange(value)}
              >
                <SelectTrigger className="bg-transparent">
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
              <FieldError>{getFieldErrors(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
}
