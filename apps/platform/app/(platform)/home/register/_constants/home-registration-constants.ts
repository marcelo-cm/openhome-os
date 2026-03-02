import {
  BasicInfoStepSchema,
  HomeDetailsStepSchema,
  HomeItemRegistrationSchema,
  ImagesStepSchema,
  SettingsStepSchema,
} from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardStepConfig } from '@openhome-os/core/wizard/wizard-types';

import {
  BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
  type BaseItemRegistrationFormValues,
} from '../../../_components/item-registration-wizard/item-registration-types';

export const HOME_REGISTRATION_STEPS: Omit<WizardStepConfig, 'content'>[] = [
  { id: 'basic-info', label: 'Basic Info', schema: BasicInfoStepSchema },
  {
    id: 'home-details',
    label: 'Details',
    schema: HomeDetailsStepSchema,
  },
  { id: 'settings', label: 'Settings', schema: SettingsStepSchema },
  { id: 'images', label: 'Images', schema: ImagesStepSchema },
];

export interface HomeFormValues extends BaseItemRegistrationFormValues {
  model_number?: string;
  warranty_expiration?: string;
}

export const HOME_DEFAULT_VALUES: HomeFormValues = {
  ...BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
};

export { HomeItemRegistrationSchema as HOME_REGISTRATION_SCHEMA };
