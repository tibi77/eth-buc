import OtpVerification from '@/pages/public/OtpVerification.js';
import { PasswordRecovery } from '@/pages/public/PasswordRecovery.js';
import LayoutPublic from '@/routes/LayoutPublic.js';
import { createRoute, redirect } from "@tanstack/react-router";
import { z } from 'zod';
import { Login } from "../pages/public/Login.js";
import { rootRoute } from "./index";

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: () => <LayoutPublic />,
});


const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/" as const,
  component: () => null,
  beforeLoad: async ({ location }) => {
    redirect({
      to: '/login',
      replace: true,
      search: {
        redirect: location.href,
      },
      throw: true,
    });
  }
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/login" as const,
  component: () => <Login />,
});

export const passwordRecoveryRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/passwordRecovery" as const,
  component: () => <PasswordRecovery />,
  validateSearch: z.object({
    email: z.string(),
  })
});

const otpVerificationRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/otp-verification" as const,
  component: () => <OtpVerification />,
  validateSearch: z.object({
    email: z.string(),
  })
});

export const publicRoute = publicLayoutRoute.addChildren([
  indexRoute,
  loginRoute,
  otpVerificationRoute,
  passwordRecoveryRoute,
]);

export { otpVerificationRoute };
