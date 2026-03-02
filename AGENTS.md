# AGENTS.md

## Cursor Cloud specific instructions

### Overview

OpenHome OS is a home inventory management platform built as a **pnpm + Turborepo monorepo**. The main product is the Next.js 16 platform app at `apps/platform` (port 3000). There is also an optional docs app at `apps/docs` (port 3001).

### Key commands

All standard dev commands are defined in the root `package.json` and orchestrated via Turborepo:

| Task                       | Command                      |
| -------------------------- | ---------------------------- |
| Dev server (all)           | `pnpm dev`                   |
| Dev server (platform only) | `pnpm --filter platform dev` |
| Lint                       | `pnpm lint`                  |
| Type-check                 | `pnpm type-check`            |
| Tests                      | `pnpm test`                  |
| Format                     | `pnpm format`                |

### Gotchas

- **`next typegen` must run before `type-check`**: The platform app uses Next.js route-level type generation (`PageProps`). Run `pnpm --filter platform exec next typegen` before `pnpm type-check` or the platform type-check will fail. The pre-commit hook does this automatically.
- **`.env.local` required for platform**: The platform app reads Supabase/DB credentials from `apps/platform/.env.local`. This file must contain `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DATABASE_PASSWORD`, `SUPABASE_BUCKET`, `SUPABASE_PROFILE_PICTURES_BUCKET`, and `NEXT_PUBLIC_SITE_URL`. All values are injected as environment variables from Cursor Cloud secrets — the update script generates this file automatically.
- **Pre-existing lint warning**: `@openhome-os/core` has an unused import warning in `db-schema.ts` (`boolean` is defined but never used). This causes `pnpm lint` to fail for that package due to `--max-warnings 0`. This is a pre-existing issue.
- **Supabase is an external dependency**: Auth and storage are provided by a hosted Supabase instance (not local). The Supabase URL must be reachable from the VM for sign-in/sign-up to work.
- **User creation requires both Supabase auth + DB record**: The sign-in flow authenticates via Supabase then queries the `users` table. Creating a user via the Supabase admin API alone is insufficient — a corresponding record must also exist in the application database.
