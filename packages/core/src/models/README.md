## Models directory structure

This folder holds domain models and related artifacts. Each resource (user, organization, etc.) follows the same structure:

```
models/
  ├── base/
  │   ├── base-types.ts        # Drizzle column builders + runtime IBaseModel shape
  │   ├── base-generator.ts    # Runtime faker base fields
  │   └── base-utils.ts        # Shared helpers (e.g., buildMany)
  ├── user/
  │   ├── user-types.ts        # zod-inferred TS types (TUser, TCreateUser, TUpdateUser)
  │   ├── user-enums.ts        # Runtime enums
  │   ├── user-schemas.ts      # zod schemas via drizzle-zod
  │   └── user-generator.ts    # Faker builders for tests and previews
  └── organization/
      ├── organization-types.ts
      ├── organization-enums.ts
      ├── organization-schemas.ts
      └── organization-generator.ts
```

### Conventions

- **Types and Schemas**
  - Database tables use `DrizzleBaseModel` in `db/db-schema.ts` via object spread.
  - Runtime shapes use `IBaseModel` (aliased as `TBaseModel`) for generated objects.
  - For each resource: `-types.ts` exports zod-inferred `T<Resource>` types.

- **Generators**
  - Prefer small, composable builders that return fully-typed runtime objects.
  - Base fields are added via `generateFakeBase()` then resource fields are merged.
  - Call-site overrides are applied last to make them authoritative.
  - Use `buildMany(factory, count)` to construct arrays deterministically.

### Usage

```ts
import { buildFakeUsers } from '@openhome-os/core/models/user/user-factory';

const [first, second] = buildFakeUsers(2, (i) => ({
  override: { email: `test-${i}@example.com` },
}));
```

### Notes

- Avoid leaking Drizzle column-builder types into runtime code. Use the runtime interfaces for generators and application logic.
- Keep enums in `-enums.ts` and reuse them across DB schema, zod, and generators.
