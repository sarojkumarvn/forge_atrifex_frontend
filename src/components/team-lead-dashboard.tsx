import type * as React from "react"
import { useMemo, useState, type ComponentType } from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  CircleGaugeIcon,
  ClipboardListIcon,
  GitBranchIcon,
  LineChartIcon,
  MessageCircleIcon,
  SearchIcon,
  ShieldAlertIcon,
  SparklesIcon,
  TerminalIcon,
  UserRoundCheckIcon,
  UsersIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"

type TeamId = "team-1" | "team-2"
type LeadSection = "dashboard" | "members" | "analytics" | "issues" | "tracks" | "reports"
type SidePanel = "messages" | "navigation"

type TeamMember = {
  name: string
  role: string
  avatar: string
  progress: number
  commits: number
  reviews: number
  previousScore: number
}

type Project = {
  id: string
  name: string
  manager: string
  team: TeamId
  status: string
  progress: number
  health: number
  risk: string
  due: string
  members: TeamMember[]
}

type MessageItem = {
  team: TeamId
  name: string
  channel: string
  subject: string
  date: string
  severity: string
  teaser: string
}

const leadProfile = {
  name: "Riya Sen",
  email: "teamlead@atrifex.ai",
  avatar: "/avatars/team-lead.jpg",
}

const teams = [
  { id: "team-1", name: "Team 1", focus: "Forge Core", members: 6 },
  { id: "team-2", name: "Team 2", focus: "AI Delivery", members: 5 },
] satisfies Array<{ id: TeamId; name: string; focus: string; members: number }>

const projects = [
  {
    id: "forge-kernel",
    name: "Forge Kernel",
    manager: "Aarav Mehta",
    team: "team-1",
    status: "Sprint 6",
    progress: 82,
    health: 91,
    risk: "Low",
    due: "Jul 12",
    members: [
      { name: "Nolan Reed", role: "Backend", avatar: "NR", progress: 88, commits: 64, reviews: 18, previousScore: 91 },
      { name: "Isha Kapoor", role: "Frontend", avatar: "IK", progress: 79, commits: 51, reviews: 23, previousScore: 86 },
      { name: "Mateo Cruz", role: "QA Automation", avatar: "MC", progress: 74, commits: 29, reviews: 15, previousScore: 82 },
    ],
  },
  {
    id: "manager-command",
    name: "Manager Command Center",
    manager: "Priya Nair",
    team: "team-1",
    status: "Release hardening",
    progress: 68,
    health: 77,
    risk: "Medium",
    due: "Jul 24",
    members: [
      { name: "Lena Ortiz", role: "Data UI", avatar: "LO", progress: 72, commits: 44, reviews: 12, previousScore: 78 },
      { name: "Dev Shah", role: "API", avatar: "DS", progress: 66, commits: 39, reviews: 17, previousScore: 74 },
    ],
  },
  {
    id: "ai-review",
    name: "AI Review Graph",
    manager: "Meera Iyer",
    team: "team-2",
    status: "Model validation",
    progress: 73,
    health: 84,
    risk: "Medium",
    due: "Aug 03",
    members: [
      { name: "Kai Morgan", role: "ML Engineer", avatar: "KM", progress: 81, commits: 48, reviews: 9, previousScore: 88 },
      { name: "Anika Rao", role: "Platform", avatar: "AR", progress: 69, commits: 36, reviews: 14, previousScore: 80 },
      { name: "Owen Park", role: "Integrations", avatar: "OP", progress: 63, commits: 31, reviews: 11, previousScore: 76 },
    ],
  },
  {
    id: "issue-radar",
    name: "Issue Radar",
    manager: "Kabir Sethi",
    team: "team-2",
    status: "Discovery",
    progress: 56,
    health: 71,
    risk: "Watch",
    due: "Aug 18",
    members: [
      { name: "Sofia Chen", role: "Product UI", avatar: "SC", progress: 61, commits: 28, reviews: 8, previousScore: 73 },
      { name: "Harun Ali", role: "Backend", avatar: "HA", progress: 54, commits: 34, reviews: 10, previousScore: 70 },
    ],
  },
] satisfies Project[]

const navItems = [
  { id: "dashboard", title: "Overview", icon: CircleGaugeIcon },
  { id: "members", title: "Project teams", icon: UsersIcon },
  { id: "analytics", title: "Member analytics", icon: BarChart3Icon },
  { id: "issues", title: "Issues created", icon: ShieldAlertIcon },
  { id: "tracks", title: "Application track", icon: GitBranchIcon },
  { id: "reports", title: "Reports", icon: ClipboardListIcon },
] satisfies Array<{ id: LeadSection; title: string; icon: ComponentType }>

const messages = [
  {
    team: "team-1",
    name: "Nolan Reed",
    channel: "Forge Kernel",
    subject: "Auth adapter blocked",
    date: "09:34",
    severity: "Issue",
    teaser: "OAuth callback is passing locally but failing staging checks after the proxy change.",
  },
  {
    team: "team-1",
    name: "Priya Nair",
    channel: "Manager Command Center",
    subject: "Manager review moved up",
    date: "10:18",
    severity: "Manager",
    teaser: "Please send the delivery snapshot before tomorrow's platform review.",
  },
  {
    team: "team-2",
    name: "Anika Rao",
    channel: "AI Review Graph",
    subject: "Vector cache regression",
    date: "11:05",
    severity: "Watch",
    teaser: "Cache misses are up 12% on the previous project comparison panel.",
  },
  {
    team: "team-2",
    name: "Sofia Chen",
    channel: "Issue Radar",
    subject: "Triage copy ready",
    date: "Yesterday",
    severity: "Update",
    teaser: "Empty and error states are ready for final review.",
  },
  {
    team: "team-1",
    name: "Isha Kapoor",
    channel: "Manager Command Center",
    subject: "Review queue cleared",
    date: "Yesterday",
    severity: "Update",
    teaser: "The data-grid review queue is clean and ready for Priya's acceptance pass.",
  },
  {
    team: "team-2",
    name: "Kai Morgan",
    channel: "AI Review Graph",
    subject: "Model report uploaded",
    date: "Yesterday",
    severity: "Report",
    teaser: "The latest validation notes are attached with drift comparison against the previous project.",
  },
] satisfies MessageItem[]

const areaData = [
  { week: "W1", planned: 54, shipped: 47 },
  { week: "W2", planned: 61, shipped: 58 },
  { week: "W3", planned: 69, shipped: 64 },
  { week: "W4", planned: 74, shipped: 72 },
  { week: "W5", planned: 83, shipped: 79 },
  { week: "W6", planned: 88, shipped: 84 },
]

const memberBarData = [
  { name: "Nolan", current: 88, previous: 91 },
  { name: "Isha", current: 79, previous: 86 },
  { name: "Kai", current: 81, previous: 88 },
  { name: "Anika", current: 69, previous: 80 },
  { name: "Sofia", current: 61, previous: 73 },
]

const issueData = [
  { name: "Blocked", value: 5, fill: "var(--chart-1)" },
  { name: "In review", value: 12, fill: "var(--chart-2)" },
  { name: "Resolved", value: 34, fill: "var(--chart-3)" },
]

const timeline = [
  { event: "Manager assignment received", owner: "Aarav Mehta", detail: "Forge Kernel entered sprint 6 with two critical paths.", time: "Today" },
  { event: "Team update posted", owner: "Nolan Reed", detail: "Auth adapter issue moved to blocker queue.", time: "Today" },
  { event: "Analysis generated", owner: "AtriFex AI", detail: "Team 2 regression risk increased on cache work.", time: "Yesterday" },
  { event: "Previous project compared", owner: "Riya Sen", detail: "Issue Radar compared against Review Graph sprint 3 baseline.", time: "Jun 17" },
]

const areaConfig = {
  planned: { label: "Planned", color: "var(--chart-1)" },
  shipped: { label: "Shipped", color: "var(--chart-2)" },
} satisfies ChartConfig

const memberConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--chart-2)" },
} satisfies ChartConfig

const issueConfig = {
  value: { label: "Issues" },
  blocked: { label: "Blocked", color: "var(--chart-1)" },
  review: { label: "In review", color: "var(--chart-2)" },
  resolved: { label: "Resolved", color: "var(--chart-3)" },
} satisfies ChartConfig

export function TeamLeadDashboard() {
  const [section, setSection] = useState<LeadSection>("dashboard")
  const [teamId, setTeamId] = useState<TeamId>("team-1")
  const [sidePanel, setSidePanel] = useState<SidePanel>("messages")
  const selectedTeam = teams.find((team) => team.id === teamId) ?? teams[0]
  const teamProjects = useMemo(
    () => projects.filter((project) => project.team === teamId),
    [teamId]
  )
  const teamMessages = useMemo(
    () => messages.filter((message) => message.team === teamId),
    [teamId]
  )

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 88)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <TeamLeadSidebar
          activeSection={section}
          activeTeam={teamId}
          activePanel={sidePanel}
          messages={teamMessages}
          onSectionChange={setSection}
          onPanelChange={setSidePanel}
          onTeamChange={setTeamId}
        />
        <SidebarInset className="overflow-hidden">
          <TeamLeadHeader section={section} team={selectedTeam.name} />
          <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
            {section === "dashboard" && (
              <OverviewPanel projects={teamProjects} team={selectedTeam} />
            )}
            {section === "members" && (
              <ProjectTeamPanel projects={teamProjects} team={selectedTeam} />
            )}
            {section === "analytics" && (
              <MemberAnalyticsPanel projects={teamProjects} team={selectedTeam} />
            )}
            {section === "issues" && <IssuesPanel messages={teamMessages} />}
            {section === "tracks" && <TrackPanel />}
            {section === "reports" && (
              <ReportsPanel projects={teamProjects} team={selectedTeam} />
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

function TeamLeadSidebar({
  activeSection,
  activeTeam,
  activePanel,
  messages,
  onSectionChange,
  onPanelChange,
  onTeamChange,
}: {
  activeSection: LeadSection
  activeTeam: TeamId
  activePanel: SidePanel
  messages: MessageItem[]
  onSectionChange: (section: LeadSection) => void
  onPanelChange: (panel: SidePanel) => void
  onTeamChange: (team: TeamId) => void
}) {
  const { setOpen } = useSidebar()
  const selectedTeam = teams.find((team) => team.id === activeTeam) ?? teams[0]

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
    >
      <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! shadow-[1px_0_0_0_var(--sidebar-border)]">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-9 md:p-0">
                <a href="/tl/dashboard" aria-label="AtriFex Team Lead dashboard">
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_24%,transparent)]">
                    <TerminalIcon />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">AtriFex</span>
                    <span className="truncate text-xs">Team Lead</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={{ children: item.title, hidden: false }}
                      onClick={() => {
                        onSectionChange(item.id)
                        onPanelChange("navigation")
                        setOpen(true)
                      }}
                      isActive={activeSection === item.id}
                      className="px-2.5 md:px-2"
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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{ children: "Messages", hidden: false }}
                onClick={() => {
                  onPanelChange("messages")
                  setOpen(true)
                }}
                isActive={activePanel === "messages"}
              >
                <MessageCircleIcon />
                <span>Messages</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="flex min-w-0 flex-1">
        {activePanel === "messages" ? (
          <>
            <SidebarHeader className="gap-3.5 p-4 shadow-[0_1px_0_0_var(--sidebar-border)]">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-foreground">Team signal board</p>
                  <p className="truncate text-xs text-muted-foreground">Messages, issues, and manager updates</p>
                </div>
                <Badge variant="secondary" className="tabular-nums">
                  {messages.length}
                </Badge>
              </div>
              <TeamSelector activeTeam={activeTeam} onTeamChange={onTeamChange} />
              <SidebarInput placeholder={`Search ${selectedTeam.name} updates...`} />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  {messages.map((message) => (
                    <button
                      className="flex w-full flex-col items-start gap-2 p-4 text-left text-sm leading-tight shadow-[0_1px_0_0_var(--sidebar-border)] transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50"
                      key={`${message.name}-${message.subject}`}
                      type="button"
                    >
                      <span className="flex w-full items-center gap-2">
                        <span className="truncate font-medium">{message.name}</span>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{message.date}</span>
                      </span>
                      <span className="flex w-full items-center gap-2">
                        <Badge variant="outline">{message.severity}</Badge>
                        <span className="truncate text-xs text-muted-foreground">{message.channel}</span>
                      </span>
                      <span className="font-medium">{message.subject}</span>
                      <span className="line-clamp-2 text-xs text-muted-foreground text-pretty">
                        {message.teaser}
                      </span>
                    </button>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </>
        ) : (
          <>
            <SidebarHeader className="gap-3.5 p-4 shadow-[0_1px_0_0_var(--sidebar-border)]">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-foreground">Dashboard sections</p>
                  <p className="truncate text-xs text-muted-foreground">Open a section, then return to messages</p>
                </div>
                <Button
                  aria-label="Open messages"
                  className="shrink-0 rounded-lg transition-transform duration-200 active:scale-[0.96]"
                  onClick={() => onPanelChange("messages")}
                  size="icon-sm"
                  variant="outline"
                >
                  <MessageCircleIcon />
                </Button>
              </div>
              <TeamSelector activeTeam={activeTeam} onTeamChange={onTeamChange} />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="px-3 py-3">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          className="h-11 rounded-xl px-3"
                          isActive={activeSection === item.id}
                          onClick={() => onSectionChange(item.id)}
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
          </>
        )}
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-2 text-sidebar-accent-foreground">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={leadProfile.avatar} alt={leadProfile.name} />
              <AvatarFallback className="rounded-lg">RS</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium">{leadProfile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{leadProfile.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  )
}

function TeamLeadHeader({ section, team }: { section: LeadSection; team: string }) {
  const activeTitle = navItems.find((item) => item.id === section)?.title ?? "Overview"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-3 px-4 shadow-[0_1px_0_0_var(--border)] md:px-6">
      <SidebarTrigger className="-ml-1 transition-transform duration-200 active:scale-[0.96]" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">Team Lead / {team}</p>
        <h1 className="truncate text-lg font-semibold text-balance">{activeTitle}</h1>
      </div>
      <Button className="hidden rounded-xl transition-transform duration-200 active:scale-[0.96] sm:inline-flex" variant="outline">
        <SearchIcon data-icon="inline-start" />
        Search
      </Button>
      <Button className="rounded-xl transition-transform duration-200 active:scale-[0.96]">
        <SparklesIcon data-icon="inline-start" />
        Generate report
      </Button>
    </header>
  )
}

function TeamSelector({
  activeTeam,
  onTeamChange,
}: {
  activeTeam: TeamId
  onTeamChange: (team: TeamId) => void
}) {
  const selectedTeam = teams.find((team) => team.id === activeTeam) ?? teams[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto min-h-11 w-full justify-between rounded-xl px-3 py-2 text-left transition-transform duration-200 active:scale-[0.96]"
          variant="outline"
        >
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{selectedTeam.name}</span>
            <span className="truncate text-xs text-muted-foreground">{selectedTeam.focus}</span>
          </span>
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuGroup>
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onSelect={() => onTeamChange(team.id)}
            >
              <UsersIcon />
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{team.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {team.focus} · {team.members} members
                </span>
              </span>
              {activeTeam === team.id && <Badge className="ml-auto" variant="secondary">Active</Badge>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OverviewPanel({ projects, team }: { projects: Project[]; team: (typeof teams)[number] }) {
  const averageProgress = Math.round(projects.reduce((total, project) => total + project.progress, 0) / projects.length)
  const averageHealth = Math.round(projects.reduce((total, project) => total + project.health, 0) / projects.length)

  return (
    <div className="flex flex-col gap-5">
      <section className="grid gap-4 lg:grid-cols-4">
        <MetricCard icon={BriefcaseBusinessIcon} label="Assigned projects" value={String(projects.length)} detail={`Handled by ${team.name}`} />
        <MetricCard icon={UsersIcon} label="Team members" value={String(team.members)} detail={team.focus} />
        <MetricCard icon={ActivityIcon} label="Avg progress" value={`${averageProgress}%`} detail="Across active projects" />
        <MetricCard icon={CircleGaugeIcon} label="Health score" value={`${averageHealth}%`} detail="Current delivery read" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.16),0_0_70px_color-mix(in_oklab,var(--primary)_12%,transparent)]">
          <CardHeader>
            <CardTitle className="text-balance">Projects assigned by managers</CardTitle>
            <CardDescription>Manager ownership, delivery status, deadline, and project risk for the selected team.</CardDescription>
            <CardAction>
              <Badge variant="secondary">{team.name}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-balance">Overall project analysis</CardTitle>
            <CardDescription>Planned work against shipped work for the last six delivery weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaConfig} className="h-72 w-full">
              <AreaChart data={areaData} margin={{ left: 0, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="planned" type="natural" fill="var(--color-planned)" fillOpacity={0.18} stroke="var(--color-planned)" />
                <Area dataKey="shipped" type="natural" fill="var(--color-shipped)" fillOpacity={0.28} stroke="var(--color-shipped)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ProjectTeamPanel({ projects, team }: { projects: Project[]; team: (typeof teams)[number] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Team members by individual project</CardTitle>
        <CardDescription>{team.name} is grouped by active project so the lead can review ownership without mixing delivery streams.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription>Assigned by {project.manager}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {project.members.map((member) => (
                  <MemberRow key={member.name} member={member} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MemberAnalyticsPanel({ projects, team }: { projects: Project[]; team: (typeof teams)[number] }) {
  const members = projects.flatMap((project) =>
    project.members.map((member) => ({ ...member, project: project.name }))
  )

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Individual analytics</CardTitle>
          <CardDescription>Current contribution score compared with previous project performance for {team.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={memberConfig} className="h-80 w-full">
            <BarChart data={memberBarData} margin={{ left: 0, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="previous" fill="var(--color-previous)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="current" fill="var(--color-current)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">View analytics by member</CardTitle>
          <CardDescription>Open a member row later to connect detailed backend history and previous project analysis.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {members.map((member) => (
            <div className="rounded-xl bg-muted/25 p-3" key={`${member.project}-${member.name}`}>
              <MemberRow member={member} />
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                <span className="tabular-nums">{member.commits} commits</span>
                <span className="tabular-nums">{member.reviews} reviews</span>
                <span className="tabular-nums">Previous {member.previousScore}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function IssuesPanel({ messages }: { messages: MessageItem[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Issues created</CardTitle>
          <CardDescription>Grouped from member updates, manager comments, and delivery blockers.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={issueConfig} className="mx-auto h-72 max-w-sm">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={issueData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92}>
                {issueData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Issue queue</CardTitle>
          <CardDescription>Prioritized items that need team lead attention.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {messages.slice(0, 3).map((issue) => (
            <div className="flex items-start gap-3 rounded-xl bg-muted/25 p-3" key={issue.subject}>
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <AlertTriangleIcon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{issue.subject}</p>
                  <Badge variant="outline">{issue.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">{issue.teaser}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TrackPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Every track of the application</CardTitle>
        <CardDescription>Chronological delivery log across manager assignments, member updates, analysis generation, and project comparisons.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {timeline.map((item) => (
          <div className="grid gap-3 rounded-xl bg-muted/25 p-4 md:grid-cols-[10rem_1fr]" key={`${item.time}-${item.event}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranchIcon />
              <span className="tabular-nums">{item.time}</span>
            </div>
            <div>
              <p className="font-medium">{item.event}</p>
              <p className="text-sm text-muted-foreground">{item.owner}</p>
              <p className="mt-1 text-sm text-pretty">{item.detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ReportsPanel({ projects, team }: { projects: Project[]; team: (typeof teams)[number] }) {
  return (
    <Tabs defaultValue="summary" className="gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-balance">Reports and analysis system</h2>
          <p className="text-sm text-muted-foreground">Switch between team-level and project-level reporting for {team.name}.</p>
        </div>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="handoff">Handoff</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="summary">
        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard icon={LineChartIcon} label="Velocity confidence" value="87%" detail="Based on current sprint shape" />
          <MetricCard icon={MessageCircleIcon} label="Open signals" value="14" detail="Messages and issue updates" />
          <MetricCard icon={UserRoundCheckIcon} label="Review coverage" value="93%" detail="Code review participation" />
        </div>
      </TabsContent>
      <TabsContent value="projects">
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="handoff">
        <Card>
          <CardHeader>
            <CardTitle>Manager-ready handoff</CardTitle>
            <CardDescription>Production placeholder for backend-generated reports and exports.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {["Risk notes", "Member deltas", "Next sprint asks"].map((item) => (
              <div className="rounded-xl bg-muted/25 p-4" key={item}>
                <p className="font-medium">{item}</p>
                <p className="mt-1 text-sm text-muted-foreground">Ready to connect to generated report data.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-2 text-3xl tabular-nums">{value}</CardTitle>
          </div>
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary shadow-[0_0_34px_color-mix(in_oklab,var(--primary)_18%,transparent)]">
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

function ProjectRow({ project }: { project: Project }) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <CardDescription>Assigned by {project.manager} · Due {project.due}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{project.status}</Badge>
            <Badge variant={project.risk === "Low" ? "outline" : "secondary"}>{project.risk} risk</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ProgressMeter label="Progress" value={project.progress} />
        <ProgressMeter label="Analysis health" value={project.health} />
      </CardContent>
    </Card>
  )
}

function MemberRow({ member }: { member: TeamMember & { project?: string } }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10 rounded-xl">
        <AvatarImage alt={member.name} src="" />
        <AvatarFallback className="rounded-xl">{member.avatar}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{member.name}</p>
          {member.project && <Badge variant="outline">{member.project}</Badge>}
        </div>
        <p className="truncate text-sm text-muted-foreground">{member.role}</p>
      </div>
      <div className="min-w-14 text-right text-sm tabular-nums">{member.progress}%</div>
    </div>
  )
}

function ProgressMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_42%,transparent)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
