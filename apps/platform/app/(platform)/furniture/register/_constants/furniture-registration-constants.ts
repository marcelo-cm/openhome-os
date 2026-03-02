import {
  BasicInfoStepSchema,
  FurnitureDetailsStepSchema,
  FurnitureItemRegistrationSchema,
  ImagesStepSchema,
  SettingsStepSchema,
} from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardStepConfig } from '@openhome-os/core/wizard/wizard-types';

import {
  BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
  type BaseItemRegistrationFormValues,
} from '../../../_components/item-registration-wizard/item-registration-types';

export const FURNITURE_REGISTRATION_STEPS: Omit<WizardStepConfig, 'content'>[] =
  [
    { id: 'basic-info', label: 'Basic Info', schema: BasicInfoStepSchema },
    {
      id: 'furniture-details',
      label: 'Details',
      schema: FurnitureDetailsStepSchema,
    },
    { id: 'settings', label: 'Settings', schema: SettingsStepSchema },
    { id: 'images', label: 'Images', schema: ImagesStepSchema },
  ];

export interface FurnitureFormValues extends BaseItemRegistrationFormValues {
  dimension_width?: number;
  dimension_height?: number;
  dimension_depth?: number;
  dimension_unit?: 'cm' | 'in';
}

export const FURNITURE_DEFAULT_VALUES: FurnitureFormValues = {
  ...BASE_ITEM_REGISTRATION_DEFAULT_VALUES,
};

export { FurnitureItemRegistrationSchema as FURNITURE_REGISTRATION_SCHEMA };
