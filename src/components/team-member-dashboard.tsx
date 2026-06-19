import type * as React from "react"
import { useEffect, useMemo, useState, type ComponentType } from "react"
import {
  BotIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  ListChecksIcon,
  LogOutIcon,
  SearchIcon,
  Settings2Icon,
  SparklesIcon,
  TerminalIcon,
  UserRoundIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DashboardProfilePage,
  DashboardSettingsPage,
  type DashboardUserProfile,
} from "@/components/dashboard-profile-pages"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type MemberView =
  | "ask-ai"
  | "home"
  | "inbox"
  | "issues-created"
  | "issues-resolved"
  | "tasks-completed"
  | "tasks-remaining"
  | "calendar"
  | "history"
  | "profile"
  | "settings"

type MemberTask = {
  title: string
  project: string
  deadline: string
  priority: "High" | "Medium" | "Low"
  status: "Remaining" | "Completed"
  progress: number
  detail: string
}

type Meeting = {
  title: string
  time: string
  owner: string
  context: string
}

type Issue = {
  title: string
  project: string
  status: "Created" | "Resolved"
  updated: string
}

const memberProfile = {
  name: "Nolan Reed",
  email: "nolan@atrifex.ai",
  avatar: "/avatars/member.jpg",
  initials: "NR",
  role: "Backend engineer",
}

const memberDashboardProfile: DashboardUserProfile = {
  name: memberProfile.name,
  email: memberProfile.email,
  avatar: memberProfile.avatar,
  initials: memberProfile.initials,
  position: memberProfile.role,
  team: "Forge Core",
  employeeId: "AFX-TM-047",
  lastActive: "Jun 20, 2026, 11:21 AM",
  roleLabel: "Team Member",
  stats: [
    { label: "Tasks completed", value: "27" },
    { label: "Issues resolved", value: "11" },
    { label: "AI reviews", value: "19" },
  ],
  analyticsHistory: [
    {
      title: "Task progress analysis",
      scope: "Forge Kernel",
      date: "Today, 10:12 AM",
      result: "2 tasks ahead of plan",
    },
    {
      title: "Contribution review",
      scope: "OAuth staging callback",
      date: "Yesterday, 6:10 PM",
      result: "Coverage improved",
    },
    {
      title: "Issue resolution history",
      scope: "Manager Command Center",
      date: "Jun 18, 2026",
      result: "Schema issue closed",
    },
    {
      title: "AI feedback session",
      scope: "Contribution mapper",
      date: "Jun 17, 2026",
      result: "Refactor notes saved",
    },
  ],
}

const tasks = [
  {
    title: "Fix OAuth staging callback",
    project: "Forge Kernel",
    deadline: "Today, 6:00 PM",
    priority: "High",
    status: "Remaining",
    progress: 62,
    detail: "Proxy callback is passing locally but failing the staging smoke test.",
  },
  {
    title: "Ship contribution event mapper",
    project: "Forge Kernel",
    deadline: "Tomorrow, 11:30 AM",
    priority: "Medium",
    status: "Remaining",
    progress: 48,
    detail: "Normalize GitHub events before the analytics worker consumes them.",
  },
  {
    title: "Write manager dashboard fixtures",
    project: "Manager Command Center",
    deadline: "Jun 21, 3:00 PM",
    priority: "Low",
    status: "Remaining",
    progress: 24,
    detail: "Create realistic fixture states for active, watch, and blocked projects.",
  },
  {
    title: "Review task status schema",
    project: "Forge Kernel",
    deadline: "Completed yesterday",
    priority: "Medium",
    status: "Completed",
    progress: 100,
    detail: "Schema merged with enum validation and migration notes.",
  },
] satisfies MemberTask[]

const issues = [
  {
    title: "Staging auth redirect returns 502",
    project: "Forge Kernel",
    status: "Created",
    updated: "Today",
  },
  {
    title: "Commit sync misses squash merges",
    project: "Forge Kernel",
    status: "Created",
    updated: "Yesterday",
  },
  {
    title: "Task status migration warning",
    project: "Manager Command Center",
    status: "Resolved",
    updated: "Jun 17",
  },
] satisfies Issue[]

const inbox = [
  {
    from: "Riya Sen",
    subject: "OAuth fix needs the staging trace attached",
    time: "09:34",
  },
  {
    from: "AtriFex AI",
    subject: "Your review coverage is ahead of sprint target",
    time: "10:12",
  },
  {
    from: "Priya Nair",
    subject: "Manager dashboard fixture set approved",
    time: "Yesterday",
  },
]

const meetings = [
  {
    title: "Auth blocker triage",
    time: "11:00 AM - 11:25 AM",
    owner: "Riya Sen",
    context: "Bring staging trace, latest callback logs, and rollback option.",
  },
  {
    title: "Sprint handoff review",
    time: "3:30 PM - 4:00 PM",
    owner: "Forge Core",
    context: "Confirm remaining tasks and mark next-day risk.",
  },
] satisfies Meeting[]

const history = [
  "Opened OAuth staging callback issue",
  "Completed task status schema review",
  "Updated contribution mapper branch",
  "Joined Forge Core daily standup",
]

const navigation = [
  { id: "ask-ai", title: "Ask AI", icon: BotIcon },
  { id: "home", title: "Home", icon: HomeIcon },
  { id: "inbox", title: "Inbox", icon: InboxIcon, badge: inbox.length },
] satisfies Array<{
  id: MemberView
  title: string
  icon: ComponentType
  badge?: number
}>

const utilityNavigation = [
  { id: "calendar", title: "Calendar", icon: CalendarDaysIcon },
  { id: "history", title: "History", icon: HistoryIcon },
] satisfies Array<{ id: MemberView; title: string; icon: ComponentType }>

const memberViewPaths: Record<MemberView, string> = {
  "ask-ai": "/tm/dashboard/ask-ai",
  home: "/tm/dashboard",
  inbox: "/tm/dashboard/inbox",
  "issues-created": "/tm/dashboard/issues-created",
  "issues-resolved": "/tm/dashboard/issues-resolved",
  "tasks-completed": "/tm/dashboard/tasks-completed",
  "tasks-remaining": "/tm/dashboard/tasks-remaining",
  calendar: "/tm/dashboard/calendar",
  history: "/tm/dashboard/history",
  profile: "/tm/dashboard/profile",
  settings: "/tm/dashboard/settings",
}

const memberPathViews: Record<string, MemberView> = {
  "": "home",
  dashboard: "home",
  "ask-ai": "ask-ai",
  inbox: "inbox",
  "issues-created": "issues-created",
  "issues-resolved": "issues-resolved",
  "tasks-completed": "tasks-completed",
  "tasks-remaining": "tasks-remaining",
  calendar: "calendar",
  history: "history",
  profile: "profile",
  settings: "settings",
}

function getMemberViewFromPath(pathname: string): MemberView {
  const slug = pathname.replace(/^\/tm\/dashboard\/?/, "").split("/")[0]

  return memberPathViews[slug] ?? "home"
}

function pushMemberView(view: MemberView) {
  const path = memberViewPaths[view]

  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path)
  }
}

export function TeamMemberDashboard() {
  const [activeView, setActiveView] = useState<MemberView>(() => {
    if (typeof window === "undefined") {
      return "home"
    }

    return getMemberViewFromPath(window.location.pathname)
  })
  const remainingTasks = useMemo(
    () => tasks.filter((task) => task.status === "Remaining"),
    []
  )
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "Completed"),
    []
  )
  const createdIssues = useMemo(
    () => issues.filter((issue) => issue.status === "Created"),
    []
  )
  const resolvedIssues = useMemo(
    () => issues.filter((issue) => issue.status === "Resolved"),
    []
  )
  const handleViewChange = (view: MemberView) => {
    pushMemberView(view)
    setActiveView(view)
  }

  useEffect(() => {
    const syncRoute = () => {
      setActiveView(getMemberViewFromPath(window.location.pathname))
    }

    window.addEventListener("popstate", syncRoute)

    return () => window.removeEventListener("popstate", syncRoute)
  }, [])

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 68)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <MemberSidebar
          activeView={activeView}
          completedCount={completedTasks.length}
          createdIssueCount={createdIssues.length}
          remainingCount={remainingTasks.length}
          resolvedIssueCount={resolvedIssues.length}
          onViewChange={handleViewChange}
        />
        <SidebarInset className="overflow-hidden">
          <MemberHeader activeView={activeView} remainingCount={remainingTasks.length} />
          <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
            <RemainingStrip tasks={remainingTasks} />
            {activeView === "ask-ai" && <AskAiPanel />}
            {activeView === "home" && (
              <HomePanel
                completedTasks={completedTasks}
                inboxCount={inbox.length}
                meetings={meetings}
                remainingTasks={remainingTasks}
              />
            )}
            {activeView === "inbox" && <InboxPanel />}
            {activeView === "issues-created" && (
              <IssuesPanel issues={createdIssues} title="Created issues" />
            )}
            {activeView === "issues-resolved" && (
              <IssuesPanel issues={resolvedIssues} title="Resolved issues" />
            )}
            {activeView === "tasks-completed" && (
              <TasksPanel tasks={completedTasks} title="Completed tasks" />
            )}
            {activeView === "tasks-remaining" && (
              <TasksPanel tasks={remainingTasks} title="Remaining tasks" />
            )}
            {activeView === "calendar" && <CalendarPanel meetings={meetings} />}
            {activeView === "history" && <HistoryPanel />}
            {activeView === "profile" && <DashboardProfilePage profile={memberDashboardProfile} />}
            {activeView === "settings" && <DashboardSettingsPage profile={memberDashboardProfile} />}
          </main>
        </SidebarInset>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  )
}

function MemberSidebar({
  activeView,
  completedCount,
  createdIssueCount,
  remainingCount,
  resolvedIssueCount,
  onViewChange,
}: {
  activeView: MemberView
  completedCount: number
  createdIssueCount: number
  remainingCount: number
  resolvedIssueCount: number
  onViewChange: (view: MemberView) => void
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/tm/dashboard">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_24%,transparent)]">
                  <TerminalIcon />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AtriFex Forge</span>
                  <span className="truncate text-xs">Member workspace</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Work queues</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Issues">
                      <CircleAlertIcon />
                      <span>Issues</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeView === "issues-created"}
                        >
                          <button onClick={() => onViewChange("issues-created")} type="button">
                            <span>Created</span>
                            <span className="ml-auto tabular-nums">{createdIssueCount}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeView === "issues-resolved"}
                        >
                          <button onClick={() => onViewChange("issues-resolved")} type="button">
                            <span>Resolved</span>
                            <span className="ml-auto tabular-nums">{resolvedIssueCount}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Tasks">
                      <ListChecksIcon />
                      <span>Tasks</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeView === "tasks-completed"}
                        >
                          <button onClick={() => onViewChange("tasks-completed")} type="button">
                            <span>Completed</span>
                            <span className="ml-auto tabular-nums">{completedCount}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeView === "tasks-remaining"}
                        >
                          <button onClick={() => onViewChange("tasks-remaining")} type="button">
                            <span>Remaining</span>
                            <span className="ml-auto tabular-nums">{remainingCount}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityNavigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <MemberUserMenu onViewChange={onViewChange} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function MemberUserMenu({ onViewChange }: { onViewChange: (view: MemberView) => void }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="size-9 rounded-xl">
                <AvatarImage src={memberProfile.avatar} alt={memberProfile.name} />
                <AvatarFallback className="rounded-xl">{memberProfile.initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{memberProfile.name}</span>
                <span className="truncate text-xs">{memberProfile.role}</span>
              </div>
              <Settings2Icon />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-9 rounded-xl">
                  <AvatarImage src={memberProfile.avatar} alt={memberProfile.name} />
                  <AvatarFallback className="rounded-xl">{memberProfile.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{memberProfile.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{memberProfile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onViewChange("profile")}>
                <UserRoundIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onViewChange("settings")}>
                <Settings2Icon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SparklesIcon />
                AI preferences
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function MemberHeader({
  activeView,
  remainingCount,
}: {
  activeView: MemberView
  remainingCount: number
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-3 px-4 shadow-[0_1px_0_0_var(--border)] md:px-6">
      <SidebarTrigger className="-ml-1 transition-transform duration-200 active:scale-[0.96]" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">Team Member / {memberProfile.name}</p>
        <h1 className="truncate text-lg font-semibold text-balance">
          {viewLabels[activeView]}
        </h1>
      </div>
      <Badge variant="secondary" className="hidden tabular-nums sm:inline-flex">
        {remainingCount} remaining
      </Badge>
      <Button className="hidden rounded-xl transition-transform duration-200 active:scale-[0.96] md:inline-flex" variant="outline">
        <SearchIcon data-icon="inline-start" />
        Search
      </Button>
      <Button className="rounded-xl transition-transform duration-200 active:scale-[0.96]">
        <BotIcon data-icon="inline-start" />
        Ask AI
      </Button>
    </header>
  )
}

const viewLabels: Record<MemberView, string> = {
  "ask-ai": "Ask AI",
  home: "Home",
  inbox: "Inbox",
  "issues-created": "Created issues",
  "issues-resolved": "Resolved issues",
  "tasks-completed": "Completed tasks",
  "tasks-remaining": "Remaining tasks",
  calendar: "Calendar",
  history: "History",
  profile: "Profile",
  settings: "Settings",
}

function RemainingStrip({ tasks }: { tasks: MemberTask[] }) {
  return (
    <section className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
      <Card className="overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.16),0_0_70px_color-mix(in_oklab,var(--primary)_12%,transparent)]">
        <CardHeader>
          <CardDescription>Remaining tasks to complete</CardDescription>
          <CardTitle className="text-4xl tabular-nums">{tasks.length}</CardTitle>
          <CardAction>
            <Badge variant="secondary">Today</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-pretty">
            Focus on the OAuth staging callback first. It is the only blocker that can affect the team lead report.
          </p>
        </CardContent>
      </Card>
      {tasks.slice(0, 2).map((task) => (
        <Card className="overflow-hidden" key={task.title}>
          <CardHeader>
            <CardDescription>{task.project}</CardDescription>
            <CardTitle className="text-base text-balance">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressMeter value={task.progress} />
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <span className="truncate text-sm text-muted-foreground">{task.deadline}</span>
            <Badge variant={task.priority === "High" ? "default" : "outline"}>
              {task.priority}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}

function HomePanel({
  completedTasks,
  inboxCount,
  meetings,
  remainingTasks,
}: {
  completedTasks: MemberTask[]
  inboxCount: number
  meetings: Meeting[]
  remainingTasks: MemberTask[]
}) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardDescription>Good morning, {memberProfile.name}</CardDescription>
              <CardTitle className="text-3xl text-balance">Your delivery board is ready.</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit tabular-nums">
              {remainingTasks.length} tasks left
            </Badge>
          </div>
          <CardDescription className="max-w-3xl text-pretty">
            The highest-impact work today is closing the staging auth blocker, checking your inbox before triage, and joining the handoff review.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ListChecksIcon} label="Remaining" value={String(remainingTasks.length)} detail="Open tasks" />
        <MetricCard icon={CheckCircle2Icon} label="Completed" value={String(completedTasks.length)} detail="Closed this sprint" />
        <MetricCard icon={InboxIcon} label="Inbox" value={String(inboxCount)} detail="Unread updates" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <TasksPanel tasks={remainingTasks} title="Tasks, deadlines, and progress" />
        <MeetingsCard meetings={meetings} />
      </section>
    </div>
  )
}

function AskAiPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Ask AI</CardTitle>
        <CardDescription>Suggested prompts based on your active tasks, issues, and upcoming meetings.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {[
          "Summarize my blocker for the team lead.",
          "Draft the staging callback fix checklist.",
          "Compare today's tasks with my previous sprint.",
        ].map((prompt) => (
          <button
            className="min-h-28 rounded-xl bg-muted/30 p-4 text-left text-sm font-medium text-pretty shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,transform] duration-200 hover:bg-muted active:scale-[0.96] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            key={prompt}
            type="button"
          >
            {prompt}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

function InboxPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbox</CardTitle>
        <CardDescription>Updates from your team lead, AI assistant, and project managers.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {inbox.map((message) => (
          <div className="rounded-xl bg-muted/25 p-4" key={message.subject}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{message.from}</p>
              <span className="text-sm text-muted-foreground tabular-nums">{message.time}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{message.subject}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function TasksPanel({ tasks, title }: { tasks: MemberTask[]; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">{title}</CardTitle>
        <CardDescription>Task ownership, deadline pressure, and current completion state.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.title} task={task} />
        ))}
      </CardContent>
    </Card>
  )
}

function TaskCard({ task }: { task: MemberTask }) {
  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base text-balance">{task.title}</CardTitle>
            <CardDescription>{task.project} · {task.deadline}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={task.status === "Completed" ? "secondary" : "outline"}>{task.status}</Badge>
            <Badge variant={task.priority === "High" ? "default" : "outline"}>{task.priority}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground text-pretty">{task.detail}</p>
        <ProgressMeter value={task.progress} />
      </CardContent>
    </Card>
  )
}

function IssuesPanel({ issues, title }: { issues: Issue[]; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Issue activity tied to your assigned project work.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {issues.map((issue) => (
          <div className="flex items-start gap-3 rounded-xl bg-muted/25 p-4" key={issue.title}>
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              {issue.status === "Resolved" ? <CircleCheckIcon /> : <CircleAlertIcon />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-balance">{issue.title}</p>
                <Badge variant={issue.status === "Resolved" ? "secondary" : "outline"}>{issue.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{issue.project} · {issue.updated}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CalendarPanel({ meetings }: { meetings: Meeting[] }) {
  return (
    <div className="max-w-3xl">
      <MeetingsCard meetings={meetings} />
    </div>
  )
}

function MeetingsCard({ meetings }: { meetings: Meeting[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Meetings to attend</CardTitle>
        <CardDescription>Timing, owner, and context for your next commitments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {meetings.map((meeting) => (
          <div className="rounded-xl bg-muted/25 p-4" key={meeting.title}>
            <div className="flex flex-wrap items-center gap-2">
              <Clock3Icon />
              <span className="font-medium tabular-nums">{meeting.time}</span>
            </div>
            <p className="mt-3 font-medium">{meeting.title}</p>
            <p className="text-sm text-muted-foreground">{meeting.owner}</p>
            <p className="mt-2 text-sm text-pretty">{meeting.context}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function HistoryPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Recent work events recorded for your member activity stream.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {history.map((event, index) => (
          <div className="grid gap-3 rounded-xl bg-muted/25 p-4 sm:grid-cols-[5rem_1fr]" key={event}>
            <span className="text-sm text-muted-foreground tabular-nums">T-{index}</span>
            <p className="font-medium">{event}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-2 text-3xl tabular-nums">{value}</CardTitle>
          </div>
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon />
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardFooter>
    </Card>
  )
}

function ProgressMeter({ value }: { value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-primary shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_42%,transparent)]",
            value === 100 && "bg-accent"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
