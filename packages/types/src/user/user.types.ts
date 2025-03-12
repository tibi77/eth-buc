import { z } from "zod";
import { RolesValues } from '../roles';
import { utcList } from './ianaTimezonesList';
export const StatusValues = ["active", "inactive", "terminated", "onboarding"] as const;
export type TStatus = typeof StatusValues[number];

export const WorkingDays = ["Mon-Fri", "Mon-Sat", "Mon-Sun", "Sun-Thu", "Sun-Fri", "Sun-Sat"] as const;
export type TWorkingDays = typeof WorkingDays[number];
export const WorkingHours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"] as const;
export type TWorkingHours = typeof WorkingHours[number];

export const UserShape = z.object({
    _id: z.string().optional(),
    email: z.string(),
    password: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
    company_name: z.string().optional(),
    company_address: z.string().optional(),
    company_tax_id: z.string().optional(),
    otp: z.string().optional(),
    otp_expire_at: z.string().optional(),
    roles: z.array(z.enum(RolesValues)).optional(),
    status: z.enum(StatusValues),
    company_whatsapp_number: z.string().optional(),
    timezone: z.enum(utcList as [
        string, ...string[]
    ]).optional(),
    week_days: z.enum(WorkingDays).optional(),
    start_time: z.enum(WorkingHours).optional(),
    end_time: z.enum(WorkingHours).optional(),
});


export const UserProfileVerificationShape = z.object({
    email: z.string(),
    first_name: z.string().min(3, "First name must be at least 3 characters long"),
    last_name: z.string().min(3, "Last name must be at least 3 characters long"),
    phone_number: z.string().min(10, "Phone number must be at least 10 characters long"),
    company_name: z.string().min(3, "Company name must be at least 3 characters long"),
    company_address: z.string().min(5, "Company address must be at least 5 characters long"),
    company_tax_id: z.string().min(5, "Company tax id must be at least 5 characters long"),
    company_whatsapp_number: z.string().min(10, "Company WhatsApp number must be at least 10 characters long").regex(/\d*/).optional(),
    timezone: z.enum(utcList as [
        string, ...string[]
    ]).optional(),
    week_days: z.enum(WorkingDays).optional(),
    start_time: z.enum(WorkingHours).optional(),
    end_time: z.enum(WorkingHours).optional(),
});

export const UserShapeNoId = UserShape.omit({
    _id: true,
});

export type TUserShapeNoId = z.infer<typeof UserShapeNoId>;

export const ValidUserShape = UserShape.pick({
    email: true,
});

export const UpdateUserShape = UserShape
    .partial();

export type TUser = z.infer<typeof UserShape>;
export type ValidUser = z.infer<typeof ValidUserShape>;
export type UpdateUser = z.infer<typeof UpdateUserShape>;
