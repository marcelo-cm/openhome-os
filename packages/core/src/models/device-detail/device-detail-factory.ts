import { faker } from '@faker-js/faker';

import { buildMany } from '../base/base-utils';
import type { TDeviceDetail } from './device-detail-types';

export function buildFakeDeviceDetail(
  options: { override?: Partial<TDeviceDetail> } = {},
): TDeviceDetail {
  const { override } = options;
  const detail: TDeviceDetail = {
    item_id: faker.string.uuid(),
    serial_number: faker.string.alphanumeric(12).toUpperCase(),
    model_number: faker.string.alphanumeric(8).toUpperCase(),
    warranty_expiration: faker.date.future().toISOString(),
  };
  return { ...detail, ...override };
}

export function buildFakeDeviceDetails(
  count = 1,
  optionsFactory?: (index: number) => { override?: Partial<TDeviceDetail> },
): TDeviceDetail[] {
  return buildMany(
    (index) => buildFakeDeviceDetail(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeDeviceDetail;
