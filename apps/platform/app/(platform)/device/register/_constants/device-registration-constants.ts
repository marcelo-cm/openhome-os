import {
  BasicInfoStepSchema,
  DeviceDetailsStepSchema,
  DeviceItemRegistrationSchema,
  ImagesStepSchema,
  SettingsStepSchema,
} from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardStepConfig } from '@openhome-os/core/wizard/wizard-types';

import {
  BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
  type BaseItemRegistrationFormValues,
} from '../../../_components/item-registration-wizard/item-registration-types';

export const DEVICE_REGISTRATION_STEPS: Omit<WizardStepConfig, 'content'>[] = [
  { id: 'basic-info', label: 'Basic Info', schema: BasicInfoStepSchema },
  {
    id: 'device-details',
    label: 'Details',
    schema: DeviceDetailsStepSchema,
  },
  { id: 'settings', label: 'Settings', schema: SettingsStepSchema },
  { id: 'images', label: 'Images', schema: ImagesStepSchema },
];

export interface DeviceFormValues extends BaseItemRegistrationFormValues {
  serial_number?: string;
  model_number?: string;
  warranty_expiration?: string;
}

export const DEVICE_DEFAULT_VALUES: DeviceFormValues = {
  ...BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
};

export { DeviceItemRegistrationSchema as DEVICE_REGISTRATION_SCHEMA };
