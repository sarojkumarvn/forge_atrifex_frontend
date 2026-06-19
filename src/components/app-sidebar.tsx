import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, CommandIcon } from "lucide-react"

const data = {
  user: {
    name: "AtriFex Admin",
    email: "admin@atrifex.ai",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "#",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      id: "delivery-health",
      title: "Delivery Health",
      url: "#",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      id: "contribution-analytics",
      title: "Contribution Analytics",
      url: "#",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      id: "projects",
      title: "Projects",
      url: "#",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      id: "teams",
      title: "Teams",
      url: "#",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      id: "employees",
      title: "Employee Directory",
      url: "#",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      id: "github-signals",
      name: "GitHub Signals",
      url: "#",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      id: "executive-reports",
      name: "Executive Reports",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
  ],
}

export function AppSidebar({
  activePage,
  onPageChange,
  onQuickCreate,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activePage?: string
  onPageChange?: (page: string) => void
  onQuickCreate?: () => void
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">AtriFex Forge</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeItem={activePage}
          onSelect={onPageChange}
          onQuickCreate={onQuickCreate}
        />
        <NavDocuments
          items={data.documents}
          activeItem={activePage}
          onSelect={onPageChange}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
