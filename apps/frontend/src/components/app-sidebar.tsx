import { useRoleGetRolesAbilities } from '@/__generated__/endpoints/roles.gen';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail
} from "@/components/ui/sidebar";
import * as React from "react";
import { useMemo } from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { data } from './utils';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: abilities } = useRoleGetRolesAbilities();

    const navItems = useMemo(() => {
        const filteredItems = data.navMain;
        return filteredItems;
    }, [abilities]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <NavMain items={navItems as unknown as typeof data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
