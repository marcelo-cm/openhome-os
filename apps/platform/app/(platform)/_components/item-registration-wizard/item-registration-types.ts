import type {
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';

export interface BaseItemRegistrationFormValues {
  name: string;
  description: string;
  brand: string;
  location_id: string;
  base_color?: string;
  notes?: string;
  purchase_price?: string;
  purchase_date?: string;
  status?: ItemStatus;
  privacy?: ItemPrivacy;
  images?: File[];
}

export const BASE_ITEM_REGISTRATION_DEFAULT_VALUES: Pick<
  BaseItemRegistrationFormValues,
  'name' | 'description' | 'brand' | 'location_id'
> = {
  name: '',
  description: '',
  brand: '',
  location_id: '',
};
