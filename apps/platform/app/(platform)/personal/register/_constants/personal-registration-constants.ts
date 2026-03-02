import type {
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';
import {
  BasicInfoStepSchema,
  ImagesStepSchema,
  PersonalDetailsStepSchema,
  PersonalItemRegistrationSchema,
  SettingsStepSchema,
} from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardStepConfig } from '@openhome-os/core/wizard/wizard-types';

export const PERSONAL_REGISTRATION_STEPS: Omit<WizardStepConfig, 'content'>[] =
  [
    { id: 'basic-info', label: 'Basic Info', schema: BasicInfoStepSchema },
    {
      id: 'personal-details',
      label: 'Details',
      schema: PersonalDetailsStepSchema,
    },
    { id: 'settings', label: 'Settings', schema: SettingsStepSchema },
    { id: 'images', label: 'Images', schema: ImagesStepSchema },
  ];

/**
 * Mirrors the Standard Schema input type of PersonalItemRegistrationSchema.
 * Required fields match z.string().min(1). Optional fields (?) match z.optional().
 * Fields with z.default() are optional at input time.
 */
export interface PersonalFormValues {
  name: string;
  description: string;
  brand: string;
  location_id: string;
  base_color?: string;
  notes?: string;
  purchase_price?: string;
  purchase_date?: string;
  material?: string;
  replacement_cycle_days?: number;
  status?: ItemStatus;
  privacy?: ItemPrivacy;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images?: any[];
}

export const PERSONAL_DEFAULT_VALUES: PersonalFormValues = {
  name: '',
  description: '',
  brand: '',
  location_id: '',
};

export { PersonalItemRegistrationSchema as PERSONAL_REGISTRATION_SCHEMA };
