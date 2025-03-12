import { z } from "zod";
import { StatusValues } from '../user';

export const AuthenticationShape = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*\/])/, {
      message:
        "Password must contain at least one uppercase letter and one special character",
    }),
});

export const AuthenticationShapeOtp = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
});

export const LoginResponseShape = z.object({
  email: z.string(),
  access_token: z.string(),
  status: z.enum(StatusValues)
});


export const PasswordRecoveryChecker = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
  confirmPassword: z.string()
});
export type TPasswordRecoveryChecker = z.infer<typeof PasswordRecoveryChecker>;
