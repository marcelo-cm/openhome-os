import {faker} from '@faker-js/faker';

const generateBaseFields = (
  override?: Partial<{id: string; created_at: Date; updated_at: Date}>
) => ({
  id: override?.id ?? faker.string.uuid(),
  created_at: override?.created_at ?? faker.date.past(),
  updated_at: override?.updated_at ?? faker.date.recent(),
});
