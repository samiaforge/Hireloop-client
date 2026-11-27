// Roles mirror the `user.additionalFields.role` enum in `lib/auth.ts`.
// The canonical definitions live in `users.ts`; re-exported here so existing
// imports from `@/lib/types/user` keep working.
export type { UserRole, UserRow } from "@/lib/types/users"
export { ROLE_META, USER_ROLES } from "@/lib/types/users"
