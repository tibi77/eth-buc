import { LayoutDashboardIcon } from "lucide-react";
import { it } from "node:test";

export const data = {
    navMain: [
        {
            title: "Dashboard",
            icon: LayoutDashboardIcon,
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                },
            ]
        }
    ],
} as const;
