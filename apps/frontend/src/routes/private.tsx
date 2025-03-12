import { Dashboard } from "@/pages/Dashboard";

import { isAuthenticated } from "@/services/authutils";
import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootRoute } from ".";
import { LayoutPrivate } from "./LayoutPrivate";
import { Profile } from "@/pages/Profile/Profile";

const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: LayoutPrivate,
  path: "/" as const,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      redirect({
        to: "/login",
        replace: true,
        search: {
          redirect: location.href,
        },
        throw: true,
      });
    }
  },
});

const profileRoute = createRoute({
  getParentRoute: () => privateRoute,
  component: () => <Profile />,
  path: "/profile" as const,
});

const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  component: () => <Dashboard />,
  path: "/dashboard" as const,
});

export const privateTree = privateRoute.addChildren([profileRoute, dashboardRoute]);
