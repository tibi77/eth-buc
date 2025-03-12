import { ChevronRight, LayoutDashboardIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "@tanstack/react-router";
import { data } from "./utils";

export function NavMain({
  items,
}: Readonly<{ items: Partial<typeof data.navMain> }>) {
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Dashboard"
            onClick={() => {
              navigate({
                to: `/dashboard`,
              });
            }}
          >
            <LayoutDashboardIcon />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => (
          <Collapsible
            key={item?.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item?.title}>
                  {item?.icon && <item.icon />}
                  <span>{item?.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item?.items?.map((subItem) => {
                    const url = `/${subItem.url}`;

                    return (
                      <Tooltip key={subItem.title}>
                        <TooltipTrigger asChild>
                          {
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link to={url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          }
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          To access this feature, upgrade plan.
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
