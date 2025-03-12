import { z } from "zod";

export enum Role {
    Admin = 'admin',
    CustomUser = 'custom_user',
    EnterpriseUser = 'enterprise_user',
    BasicUser = 'basic_user',
}
// make roles exhaustive
export const RolesValues = [
    Role.Admin,
    Role.CustomUser,
    Role.EnterpriseUser,
    Role.BasicUser,
] as const;

export const RoleAbilities = z.object({
    role: z.enum(RolesValues),
    disabledWidgets: z.array(z.string()),
    // if 0, then no limit
    maxMBFiles: z.number(),
    accessToUsers: z.boolean(),
    accessToAllInvoices: z.boolean(),
});

export type TRoleAbilities = z.infer<typeof RoleAbilities>;

export const MAX_NO_LIMIT = 20;