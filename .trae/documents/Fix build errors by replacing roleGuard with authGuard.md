I will fix the build errors by replacing the missing `roleGuard` with `authGuard` in the affected route files.

1.  **Modify `src/app/modules/hr-management/hr-management.routes.ts`**:
    *   Update the import to load `authGuard` from `../../guards/auth.guard`.
    *   Replace `roleGuard` with `authGuard` in the `canActivate` array.

2.  **Modify `src/app/modules/organization-management/organization-management.routes.ts`**:
    *   Remove the unused and broken import of `roleGuard`. (It is not used in the route configuration, so removing it fixes the error without changing behavior).
