import {
  BasicInfoStepSchema,
  ClothingDetailsStepSchema,
  ClothingItemRegistrationSchema,
  ImagesStepSchema,
  SettingsStepSchema,
} from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardStepConfig } from '@openhome-os/core/wizard/wizard-types';

import {
  BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
  type BaseItemRegistrationFormValues,
} from '../../../_components/item-registration-wizard/item-registration-types';

export const CLOTHING_REGISTRATION_STEPS: Omit<WizardStepConfig, 'content'>[] =
  [
    { id: 'basic-info', label: 'Basic Info', schema: BasicInfoStepSchema },
    {
      id: 'clothing-details',
      label: 'Details',
      schema: ClothingDetailsStepSchema,
    },
    { id: 'settings', label: 'Settings', schema: SettingsStepSchema },
    { id: 'images', label: 'Images', schema: ImagesStepSchema },
  ];

export interface ClothingFormValues extends BaseItemRegistrationFormValues {
  size?: string;
  material?: string;
  care_instructions?: string;
}

export const CLOTHING_DEFAULT_VALUES: ClothingFormValues = {
  ...BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
};

export { ClothingItemRegistrationSchema as CLOTHING_REGISTRATION_SCHEMA };
