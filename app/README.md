# App Directory Structure

This folder contains all routes, pages, and layouts for the OpenHome OS platform using Next.js 15 App Router conventions.

## Overview

The `app/` directory leverages Next.js App Router for file-based routing. Each route follows a consistent architectural pattern that separates concerns across layers, components, and page entry points.

## Route Structure Pattern

Each route in the application follows this consistent structure:

```
app/
├── (route-group)/          # Optional: Route groups for organization
│   └── [route]/            # Individual route (becomes URL path)
│       ├── _components/    # Route-specific UI components
│       │   └── [component].tsx
│       ├── _layers/        # View orchestration layer
│       │   ├── [route]-view.tsx
│       │   └── [route]-suspense.tsx  # Optional: Suspense wrapper for async data
│       └── page.tsx        # Next.js page entry point
```

### Layer Responsibilities

#### 1. `page.tsx` (Entry Point)

- Next.js route page that serves as the entry point
- Handles page-level layout and wrapper structure
- Should be minimal - primarily responsible for:
  - Server-side data fetching (if needed)
  - Page-level layout structure
  - Passing data to view layer

#### 2. `_layers/[route]-view.tsx` (View Layer)

- Orchestrates components and application logic
- Can consume server-side fetched data passed from `page.tsx`
- Handles state management for the route
- Composes UI components from `_components/`
- Named as `[route]-view.tsx` (e.g., `sign-in-view.tsx`)

#### 3. `_layers/[route]-suspense.tsx` (Suspense Layer - Optional)

- Optional wrapper that handles loading states for async operations
- Wraps the view layer with React Suspense boundaries
- Defines fallback UI while data is loading or streaming
- Named as `[route]-suspense.tsx` (e.g., `dashboard-suspense.tsx`)
- **Only create when route requires async data fetching or streaming**

**When to use:**

- Routes that fetch data server-side and need loading states
- Routes with multiple async data sources that can stream independently
- Routes that benefit from progressive rendering

**Example:**

```tsx
const DashboardPage = ({ userId }: DashboardPageProps) => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView userId={userId} />
    </Suspense>
  );
};

export default DashboardPage;
```

#### 4. `_components/` (UI Components)

- Contains route-specific presentational components
- Should be reusable within the route context
- Follows component naming conventions (e.g., `sign-in-card.tsx`)
- For complex components, can have companion files in a folder by the component name:
  - `[component]-types.ts`
  - `[component]-utils.ts`
  - `[component]-constants.ts`

## Route Groups

Folders wrapped in parentheses `(folder-name)` are route groups that:

- Organize routes logically without affecting the URL structure
- Can share layouts via `layout.tsx` within the group
- Example: `(auth)/` groups authentication-related routes

```
app/
├── (auth)/                 # Route group - doesn't appear in URL
│   ├── sign-in/            # URL: /sign-in
│   ├── sign-up/            # URL: /sign-up
│   └── layout.tsx          # Optional: Shared layout for auth routes
```

## Conventions

### File Naming

- **Routes/Folders**: `kebab-case` (e.g., `sign-in/`, `user-profile/`)
- **Components**: `kebab-case` (e.g., `sign-in-card.tsx`)
- **Views**: `[route]-view.tsx` pattern (e.g., `sign-in-view.tsx`)
- **Suspense Wrappers**: `[route]-suspense.tsx` pattern (e.g., `dashboard-suspense.tsx`)

### Prefixed Folders

- `_components/` - Underscore prefix indicates private/internal folder (not a route)
- `_layers/` - Underscore prefix indicates private/internal folder (not a route)

### Data Fetching

- Prefer Server Components and SSR when possible
- Fetch data in `page.tsx` and pass to view layer
- Use Suspense boundaries for streaming and loading states
- Minimize use of `'use client'` directive

### Component Organization

- Route-specific components go in `_components/`
- Shared components across routes go in `/components/`
- UI primitives (button, card, etc.) go in `/components/ui/`

## Best Practices

1. **Keep pages lightweight** - Move logic to view layer or components
2. **Server Components by default** - Only use `'use client'` when necessary
3. **Data fetching** - Fetch in `page.tsx`, consume in `_layers/`
4. **Component scope** - Route-specific in `_components/`, shared in `/components/`
5. **Consistent naming** - Follow `[route]-view.tsx` pattern for views
6. **Type safety** - Fully type all components and data flows
7. **Responsive design** - Mobile-first approach with Tailwind CSS

## Architecture Flow

The architecture follows a clear unidirectional flow:

```
page.tsx (Entry + SSR Data Fetching)
    ↓
[route]-suspense.tsx (Optional: Loading States)
    ↓
[route]-view.tsx (Orchestration + State)
    ↓
_components/ (Presentation)
```

**Key Points:**

- Entry point (`page.tsx`) handles data fetching and passes to layers
- Optional suspense layer (`[route]-suspense.tsx`) manages loading states
- View layer (`[route]-view.tsx`) orchestrates components and logic
- Components (`_components/`) focus on presentation
- The underscore prefix `_` ensures `_components/` and `_layers/` aren't treated as routes by Next.js
