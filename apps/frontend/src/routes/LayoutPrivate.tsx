import { Link, Outlet, useMatches } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authContext } from "@/services/authcontext";
import React, { useContext, useMemo } from "react";

export const LayoutPrivate = () => {
  const matches = useMatches();
  const breadcrumbs = useMemo(
    () =>
      matches
        .filter(
          (match) => match.pathname !== "/" && match.pathname !== "/default"
        )
        .map((match) => {
          return {
            key: match.pathname,
            path: match.pathname,
          };
        }),
    [matches]
  );
  const { loggedIn } = useContext(authContext);

  if (!loggedIn) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.key}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                       {/* add breadcrumb maybe */}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
