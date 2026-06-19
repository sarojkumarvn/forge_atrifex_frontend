import * as React from "react"
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BookOpenCheckIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  Clock3Icon,
  FileChartColumnIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GitPullRequestIcon,
  ListChecksIcon,
  RadioTowerIcon,
  SearchCheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import data from "@/app/dashboard/data.json"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import {
  DashboardProfilePage,
  DashboardSettingsPage,
  type DashboardUserProfile,
} from "@/components/dashboard-profile-pages"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type AdminPage =
  | "dashboard"
  | "delivery-health"
  | "contribution-analytics"
  | "projects"
  | "teams"
  | "github-signals"
  | "executive-reports"
  | "quick-create"
  | "employees"
  | "profile"
  | "settings"

type Team = {
  id: string
  name: string
  lead: string
  manager: string
  status: "Active" | "Watch" | "Paused"
  deliveryHealth: number
  progress: number
  performance: number
  repositories: number
  members: { name: string; role: string; tasks: number; progress: number }[]
  tasks: { name: string; owner: string; status: string; progress: number }[]
  currentRecord: string
  pastRecord: string
  github: { commits: number; pullRequests: number; issues: number; reviews: number }
  reports: { title: string; sentTo: string; cadence: string; status: string }
  trend: { sprint: string; delivery: number; quality: number; commits: number }[]
}

type EmployeeRole = "Team Lead" | "Team Member"

type Employee = {
  id: string
  name: string
  role: EmployeeRole
  title: string
  team: string
  previousLeadOf?: string
  previousContributorOf: string[]
  domains: string[]
  availability: "Available" | "Allocated" | "Limited"
  load: number
}

const teams: Team[] = [
  {
    id: "platform-core",
    name: "Platform Core",
    lead: "Ira Sen",
    manager: "Nolan Hart",
    status: "Active",
    deliveryHealth: 94,
    progress: 88,
    performance: 91,
    repositories: 5,
    currentRecord: "Payment orchestration and tenant controls are ahead of plan.",
    pastRecord: "Closed 42 of 47 sprint items across the last two releases.",
    members: [
      { name: "Maya Rao", role: "Backend", tasks: 7, progress: 92 },
      { name: "Dev Malik", role: "Frontend", tasks: 5, progress: 86 },
      { name: "Sofia Kim", role: "QA", tasks: 6, progress: 89 },
      { name: "Arjun Mehta", role: "Infra", tasks: 4, progress: 81 },
    ],
    tasks: [
      { name: "Tenant billing guardrails", owner: "Maya Rao", status: "Review", progress: 92 },
      { name: "Admin audit timeline", owner: "Dev Malik", status: "Build", progress: 78 },
      { name: "Regression pack", owner: "Sofia Kim", status: "Ready", progress: 96 },
    ],
    github: { commits: 312, pullRequests: 48, issues: 17, reviews: 76 },
    reports: {
      title: "Platform execution brief",
      sentTo: "Nolan Hart",
      cadence: "Weekly",
      status: "Submitted",
    },
    trend: [
      { sprint: "S1", delivery: 72, quality: 78, commits: 118 },
      { sprint: "S2", delivery: 79, quality: 83, commits: 144 },
      { sprint: "S3", delivery: 84, quality: 87, commits: 161 },
      { sprint: "S4", delivery: 88, quality: 91, commits: 188 },
    ],
  },
  {
    id: "ai-workbench",
    name: "AI Workbench",
    lead: "Leon Park",
    manager: "Priya Menon",
    status: "Watch",
    deliveryHealth: 82,
    progress: 73,
    performance: 86,
    repositories: 4,
    currentRecord: "Model evaluation is strong; review queue needs attention.",
    pastRecord: "Reduced prompt defect rate by 18% over the last month.",
    members: [
      { name: "Nisha Verma", role: "ML", tasks: 8, progress: 76 },
      { name: "Owen Blake", role: "Backend", tasks: 6, progress: 72 },
      { name: "Tara Singh", role: "Product", tasks: 3, progress: 83 },
      { name: "Eli Brooks", role: "Frontend", tasks: 5, progress: 69 },
    ],
    tasks: [
      { name: "Evaluation dashboard", owner: "Nisha Verma", status: "Build", progress: 75 },
      { name: "Prompt registry API", owner: "Owen Blake", status: "Blocked", progress: 58 },
      { name: "Experiment comparison UX", owner: "Eli Brooks", status: "Review", progress: 82 },
    ],
    github: { commits: 244, pullRequests: 39, issues: 28, reviews: 58 },
    reports: {
      title: "Model operations summary",
      sentTo: "Priya Menon",
      cadence: "Biweekly",
      status: "Needs update",
    },
    trend: [
      { sprint: "S1", delivery: 68, quality: 74, commits: 98 },
      { sprint: "S2", delivery: 73, quality: 82, commits: 121 },
      { sprint: "S3", delivery: 71, quality: 84, commits: 116 },
      { sprint: "S4", delivery: 73, quality: 86, commits: 132 },
    ],
  },
  {
    id: "customer-apps",
    name: "Customer Apps",
    lead: "Amara Wells",
    manager: "Nolan Hart",
    status: "Active",
    deliveryHealth: 89,
    progress: 84,
    performance: 88,
    repositories: 6,
    currentRecord: "Mobile onboarding and dashboard refresh are moving cleanly.",
    pastRecord: "Improved activation funnel by 11 points in the last release.",
    members: [
      { name: "Jay Patel", role: "Mobile", tasks: 5, progress: 88 },
      { name: "Lina Cho", role: "Design", tasks: 4, progress: 91 },
      { name: "Marcus Lee", role: "Frontend", tasks: 7, progress: 80 },
      { name: "Fatima Noor", role: "QA", tasks: 5, progress: 86 },
    ],
    tasks: [
      { name: "Mobile onboarding", owner: "Jay Patel", status: "Build", progress: 84 },
      { name: "Usage analytics cards", owner: "Marcus Lee", status: "Review", progress: 89 },
      { name: "Accessibility sweep", owner: "Fatima Noor", status: "Ready", progress: 94 },
    ],
    github: { commits: 286, pullRequests: 44, issues: 19, reviews: 63 },
    reports: {
      title: "Customer surface report",
      sentTo: "Nolan Hart",
      cadence: "Weekly",
      status: "Submitted",
    },
    trend: [
      { sprint: "S1", delivery: 76, quality: 80, commits: 103 },
      { sprint: "S2", delivery: 81, quality: 84, commits: 137 },
      { sprint: "S3", delivery: 86, quality: 87, commits: 142 },
      { sprint: "S4", delivery: 84, quality: 88, commits: 151 },
    ],
  },
  {
    id: "infra-reliability",
    name: "Infra Reliability",
    lead: "Noah Quinn",
    manager: "Priya Menon",
    status: "Active",
    deliveryHealth: 91,
    progress: 79,
    performance: 90,
    repositories: 7,
    currentRecord: "Incident tooling is healthy; migration work is staged.",
    pastRecord: "Cut deployment rollback rate from 7% to 3%.",
    members: [
      { name: "Sam George", role: "SRE", tasks: 6, progress: 82 },
      { name: "Hana Ali", role: "Cloud", tasks: 5, progress: 77 },
      { name: "Victor Chen", role: "Security", tasks: 4, progress: 84 },
      { name: "Reva Iyer", role: "DevOps", tasks: 6, progress: 75 },
    ],
    tasks: [
      { name: "Observability budget", owner: "Sam George", status: "Review", progress: 88 },
      { name: "Cluster migration", owner: "Hana Ali", status: "Build", progress: 67 },
      { name: "Secret rotation", owner: "Victor Chen", status: "Ready", progress: 93 },
    ],
    github: { commits: 198, pullRequests: 35, issues: 14, reviews: 69 },
    reports: {
      title: "Reliability risk memo",
      sentTo: "Priya Menon",
      cadence: "Weekly",
      status: "Submitted",
    },
    trend: [
      { sprint: "S1", delivery: 71, quality: 82, commits: 92 },
      { sprint: "S2", delivery: 75, quality: 86, commits: 104 },
      { sprint: "S3", delivery: 78, quality: 88, commits: 111 },
      { sprint: "S4", delivery: 79, quality: 90, commits: 123 },
    ],
  },
]

const employees: Employee[] = [
  {
    id: "ira-sen",
    name: "Ira Sen",
    role: "Team Lead",
    title: "Principal backend lead",
    team: "Platform Core",
    previousLeadOf: "Billing Modernization",
    previousContributorOf: ["Tenant controls", "Payment orchestration"],
    domains: ["Payments", "API architecture", "Platform governance"],
    availability: "Limited",
    load: 86,
  },
  {
    id: "maya-rao",
    name: "Maya Rao",
    role: "Team Member",
    title: "Backend engineer",
    team: "Platform Core",
    previousContributorOf: ["Tenant billing guardrails", "Identity services"],
    domains: ["Node services", "Billing", "Data contracts"],
    availability: "Allocated",
    load: 78,
  },
  {
    id: "dev-malik",
    name: "Dev Malik",
    role: "Team Member",
    title: "Frontend engineer",
    team: "Platform Core",
    previousContributorOf: ["Admin audit timeline", "Design systems"],
    domains: ["React", "Admin UX", "Accessibility"],
    availability: "Available",
    load: 64,
  },
  {
    id: "sofia-kim",
    name: "Sofia Kim",
    role: "Team Member",
    title: "QA automation engineer",
    team: "Platform Core",
    previousContributorOf: ["Regression pack", "Release certification"],
    domains: ["Automation", "Regression", "Quality gates"],
    availability: "Available",
    load: 59,
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Team Member",
    title: "Infrastructure engineer",
    team: "Platform Core",
    previousContributorOf: ["Tenant infrastructure", "Runtime controls"],
    domains: ["Cloud infra", "Observability", "Kubernetes"],
    availability: "Limited",
    load: 81,
  },
  {
    id: "leon-park",
    name: "Leon Park",
    role: "Team Lead",
    title: "ML platform lead",
    team: "AI Workbench",
    previousLeadOf: "Prompt Evaluation Suite",
    previousContributorOf: ["Model evaluation", "Experiment operations"],
    domains: ["ML systems", "Evaluation", "AI tooling"],
    availability: "Allocated",
    load: 82,
  },
  {
    id: "nisha-verma",
    name: "Nisha Verma",
    role: "Team Member",
    title: "Machine learning engineer",
    team: "AI Workbench",
    previousContributorOf: ["Evaluation dashboard", "Prompt test harness"],
    domains: ["ML evaluation", "Python", "Model telemetry"],
    availability: "Limited",
    load: 88,
  },
  {
    id: "owen-blake",
    name: "Owen Blake",
    role: "Team Member",
    title: "Backend engineer",
    team: "AI Workbench",
    previousContributorOf: ["Prompt registry API", "Inference gateway"],
    domains: ["API design", "Postgres", "AI operations"],
    availability: "Available",
    load: 61,
  },
  {
    id: "tara-singh",
    name: "Tara Singh",
    role: "Team Member",
    title: "Product engineer",
    team: "AI Workbench",
    previousContributorOf: ["Experiment comparison", "Research workflows"],
    domains: ["Product systems", "Research UX", "Analytics"],
    availability: "Available",
    load: 55,
  },
  {
    id: "eli-brooks",
    name: "Eli Brooks",
    role: "Team Member",
    title: "Frontend engineer",
    team: "AI Workbench",
    previousContributorOf: ["Experiment comparison UX", "Evaluation console"],
    domains: ["React", "Visualization", "Interaction design"],
    availability: "Allocated",
    load: 74,
  },
  {
    id: "amara-wells",
    name: "Amara Wells",
    role: "Team Lead",
    title: "Customer experience lead",
    team: "Customer Apps",
    previousLeadOf: "Activation Funnel Refresh",
    previousContributorOf: ["Mobile onboarding", "Usage analytics"],
    domains: ["Mobile", "Customer analytics", "Growth systems"],
    availability: "Available",
    load: 67,
  },
  {
    id: "jay-patel",
    name: "Jay Patel",
    role: "Team Member",
    title: "Mobile engineer",
    team: "Customer Apps",
    previousContributorOf: ["Mobile onboarding", "Push notification flows"],
    domains: ["React Native", "Onboarding", "Release tooling"],
    availability: "Allocated",
    load: 76,
  },
  {
    id: "lina-cho",
    name: "Lina Cho",
    role: "Team Member",
    title: "Product designer",
    team: "Customer Apps",
    previousContributorOf: ["Dashboard refresh", "Activation experiments"],
    domains: ["Design systems", "Activation UX", "Research"],
    availability: "Available",
    load: 58,
  },
  {
    id: "marcus-lee",
    name: "Marcus Lee",
    role: "Team Member",
    title: "Frontend engineer",
    team: "Customer Apps",
    previousContributorOf: ["Usage analytics cards", "Customer dashboards"],
    domains: ["React", "Charts", "Customer portals"],
    availability: "Limited",
    load: 84,
  },
  {
    id: "fatima-noor",
    name: "Fatima Noor",
    role: "Team Member",
    title: "QA engineer",
    team: "Customer Apps",
    previousContributorOf: ["Accessibility sweep", "Release validation"],
    domains: ["Accessibility", "Manual QA", "Regression"],
    availability: "Available",
    load: 53,
  },
  {
    id: "noah-quinn",
    name: "Noah Quinn",
    role: "Team Lead",
    title: "Reliability lead",
    team: "Infra Reliability",
    previousLeadOf: "Deployment Resilience",
    previousContributorOf: ["Incident tooling", "Cluster migration"],
    domains: ["SRE", "Reliability", "Cloud migrations"],
    availability: "Limited",
    load: 89,
  },
  {
    id: "sam-george",
    name: "Sam George",
    role: "Team Member",
    title: "SRE",
    team: "Infra Reliability",
    previousContributorOf: ["Observability budget", "Incident review"],
    domains: ["SLOs", "Telemetry", "Runbooks"],
    availability: "Allocated",
    load: 79,
  },
  {
    id: "hana-ali",
    name: "Hana Ali",
    role: "Team Member",
    title: "Cloud engineer",
    team: "Infra Reliability",
    previousContributorOf: ["Cluster migration", "Cost controls"],
    domains: ["AWS", "Kubernetes", "Terraform"],
    availability: "Available",
    load: 62,
  },
  {
    id: "victor-chen",
    name: "Victor Chen",
    role: "Team Member",
    title: "Security engineer",
    team: "Infra Reliability",
    previousContributorOf: ["Secret rotation", "Access hardening"],
    domains: ["Security", "IAM", "Compliance"],
    availability: "Available",
    load: 57,
  },
  {
    id: "reva-iyer",
    name: "Reva Iyer",
    role: "Team Member",
    title: "DevOps engineer",
    team: "Infra Reliability",
    previousContributorOf: ["Release pipelines", "Deployment rollback"],
    domains: ["CI/CD", "Containers", "Release automation"],
    availability: "Allocated",
    load: 71,
  },
]

const pageMeta: Record<AdminPage, { title: string; description: string }> = {
  dashboard: {
    title: "Admin Dashboard",
    description: "Executive overview across delivery, contribution, and repository signals.",
  },
  "delivery-health": {
    title: "Delivery Health",
    description: "Precise team-level health, risks, blockers, and delivery movement.",
  },
  "contribution-analytics": {
    title: "Contribution Analytics",
    description: "Team leads, members, assignments, progress, and work records.",
  },
  projects: {
    title: "Projects",
    description: "Active project lanes mapped to team ownership and delivery state.",
  },
  teams: {
    title: "Teams",
    description: "Dynamic team records with current and historical performance.",
  },
  "github-signals": {
    title: "GitHub Signals",
    description: "Repository activity by team and individual contributor.",
  },
  "executive-reports": {
    title: "Executive Reports",
    description: "Team-lead reports sent to managers and executives.",
  },
  "quick-create": {
    title: "Quick Create",
    description: "Create a project, attach its repository, and assign it to a team.",
  },
  employees: {
    title: "Employee Directory",
    description: "Review team leads, team members, roles, domains, and availability.",
  },
  profile: {
    title: "Profile",
    description: "View your role, account details, and analytics activity history.",
  },
  settings: {
    title: "Settings",
    description: "Update dashboard theme and visible availability.",
  },
}

const adminPagePaths: Record<AdminPage, string> = {
  dashboard: "/admin/dashboard",
  "delivery-health": "/admin/dashboard/delivery-health",
  "contribution-analytics": "/admin/dashboard/analytics",
  projects: "/admin/dashboard/projects",
  teams: "/admin/dashboard/teams",
  "github-signals": "/admin/dashboard/github-signals",
  "executive-reports": "/admin/dashboard/executive-reports",
  "quick-create": "/admin/dashboard/quick-create",
  employees: "/admin/dashboard/employees",
  profile: "/admin/dashboard/profile",
  settings: "/admin/dashboard/settings",
}

const adminPathPages: Record<string, AdminPage> = {
  "": "dashboard",
  dashboard: "dashboard",
  "delivery-health": "delivery-health",
  analytics: "contribution-analytics",
  "contribution-analytics": "contribution-analytics",
  projects: "projects",
  teams: "teams",
  "github-signals": "github-signals",
  "executive-reports": "executive-reports",
  "quick-create": "quick-create",
  employees: "employees",
  profile: "profile",
  settings: "settings",
}

const adminProfile: DashboardUserProfile = {
  name: "AtriFex Admin",
  email: "admin@atrifex.ai",
  avatar: "/avatars/shadcn.jpg",
  initials: "AA",
  position: "Delivery Operations Manager",
  team: "Admin command center",
  employeeId: "AFX-ADM-001",
  lastActive: "Jun 20, 2026, 11:42 AM",
  roleLabel: "Admin",
  stats: [
    { label: "Analyses", value: "48" },
    { label: "Approvals", value: "21" },
    { label: "Risk notes", value: "09" },
  ],
  analyticsHistory: [
    {
      title: "Contribution health audit",
      scope: "12 projects reviewed",
      date: "Today, 10:35 AM",
      result: "3 delivery risks flagged",
    },
    {
      title: "GitHub signal analysis",
      scope: "Forge Kernel",
      date: "Yesterday, 4:20 PM",
      result: "Review velocity improved 18%",
    },
    {
      title: "Team workload balance",
      scope: "AI Delivery team",
      date: "Jun 18, 2026",
      result: "2 members moved to normal load",
    },
    {
      title: "Executive delivery report",
      scope: "Manager Command Center",
      date: "Jun 17, 2026",
      result: "Release hardening approved",
    },
  ],
}

const deliveryChartConfig = {
  delivery: { label: "Delivery", color: "var(--chart-1)" },
  quality: { label: "Quality", color: "var(--chart-2)" },
} satisfies ChartConfig

const githubChartConfig = {
  commits: { label: "Commits", color: "var(--chart-1)" },
} satisfies ChartConfig

function getAdminPageFromPath(pathname: string): AdminPage {
  const slug = pathname.replace(/^\/admin\/dashboard\/?/, "").split("/")[0]

  return adminPathPages[slug] ?? "dashboard"
}

function pushAdminPage(page: AdminPage) {
  const path = adminPagePaths[page]

  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path)
  }
}

export function AdminDashboard() {
  const [activePage, setActivePage] = React.useState<AdminPage>(() => {
    if (typeof window === "undefined") {
      return "dashboard"
    }

    return getAdminPageFromPath(window.location.pathname)
  })
  const [selectedTeamId, setSelectedTeamId] = React.useState(teams[0].id)
  const selectedTeam = teams.find((team) => team.id === selectedTeamId) ?? teams[0]
  const meta = pageMeta[activePage]

  const handlePageChange = (page: string) => {
    const nextPage = page as AdminPage

    pushAdminPage(nextPage)
    setActivePage(nextPage)
  }

  React.useEffect(() => {
    const syncRoute = () => {
      setActivePage(getAdminPageFromPath(window.location.pathname))
    }

    window.addEventListener("popstate", syncRoute)

    return () => window.removeEventListener("popstate", syncRoute)
  }, [])

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 13)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          activePage={activePage}
          onPageChange={handlePageChange}
          onQuickCreate={() => handlePageChange("quick-create")}
        />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          <SiteHeader title={meta.title} description={meta.description} />
          <main className="@container/main flex flex-1 flex-col">
            {activePage === "dashboard" ? <DashboardOverview /> : null}
            {activePage === "delivery-health" ? <DeliveryHealthPage /> : null}
            {activePage === "contribution-analytics" ? (
              <ContributionAnalyticsPage
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeamId}
              />
            ) : null}
            {activePage === "projects" ? <ProjectsPage /> : null}
            {activePage === "teams" ? (
              <TeamsPage
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeamId}
              />
            ) : null}
            {activePage === "github-signals" ? <GithubSignalsPage /> : null}
            {activePage === "executive-reports" ? <ExecutiveReportsPage /> : null}
            {activePage === "quick-create" ? <QuickCreatePage /> : null}
            {activePage === "employees" ? <EmployeeDirectoryPage /> : null}
            {activePage === "profile" ? <DashboardProfilePage profile={adminProfile} /> : null}
            {activePage === "settings" ? <DashboardSettingsPage profile={adminProfile} /> : null}
          </main>
        </SidebarInset>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  )
}

function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="hidden sm:block">
        <SectionCards />
      </div>
      <div className="mx-4 grid w-[calc(100vw-3rem)] gap-3 sm:hidden">
        {[
          ["Active Projects", "37", "12 projects moved into execution"],
          ["Deadline Risk", "9", "API and review queues need attention"],
          ["Commits This Week", "1,248", "Across 18 connected repositories"],
          ["Team Efficiency", "92%", "Focus time is improving"],
        ].map(([label, value, detail]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                {value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {detail}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="mx-4 grid w-[calc(100vw-3rem)] gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Delivery board</p>
            <p className="text-xs text-muted-foreground">Priority workstreams</p>
          </div>
          <Badge variant="outline">{data.length} records</Badge>
        </div>
        {data.slice(0, 5).map((item) => (
          <Card key={item.id} size="sm">
            <CardHeader>
              <CardDescription>{item.type}</CardDescription>
              <CardTitle>{item.header}</CardTitle>
              <CardAction>
                <StatusBadge status={item.status} />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ProgressMeter value={Number(item.target)} label="Progress" />
              <div className="grid grid-cols-2 gap-2">
                <MetricChip label="Risk" value={item.limit} />
                <MetricChip label="Reviewer" value={item.reviewer} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden md:block">
        <DataTable data={data} />
      </div>
    </div>
  )
}

function DeliveryHealthPage() {
  const totals = React.useMemo(
    () => ({
      averageHealth: Math.round(
        teams.reduce((sum, team) => sum + team.deliveryHealth, 0) / teams.length
      ),
      averageProgress: Math.round(
        teams.reduce((sum, team) => sum + team.progress, 0) / teams.length
      ),
      pullRequests: teams.reduce((sum, team) => sum + team.github.pullRequests, 0),
      issues: teams.reduce((sum, team) => sum + team.github.issues, 0),
    }),
    []
  )

  return (
    <PageFrame>
      <MetricGrid
        metrics={[
          { label: "Delivery health", value: `${totals.averageHealth}%`, detail: "Weighted across active teams", icon: ShieldCheckIcon },
          { label: "Overall progress", value: `${totals.averageProgress}%`, detail: "Current sprint completion", icon: ListChecksIcon },
          { label: "Open risk issues", value: totals.issues.toString(), detail: "Tracked from delivery and GitHub", icon: AlertTriangleIcon },
          { label: "Pull requests", value: totals.pullRequests.toString(), detail: "Waiting, merged, and reviewed", icon: GitPullRequestIcon },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardDescription>Precision health view</CardDescription>
            <CardTitle>Team delivery signal rail</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {teams.map((team) => (
              <SignalRail key={team.id} team={team} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Four sprint movement</CardDescription>
            <CardTitle>Delivery and quality trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deliveryChartConfig} className="h-[320px] w-full">
              <LineChart data={teams.flatMap((team) => team.trend.map((item) => ({ ...item, team: team.name })))}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="sprint" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line dataKey="delivery" type="monotone" stroke="var(--color-delivery)" strokeWidth={2} dot={false} />
                <Line dataKey="quality" type="monotone" stroke="var(--color-quality)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <RecordTable
        title="Delivery records"
        description="Current blockers, progress, health, and ownership."
        columns={["Team", "Lead", "Status", "Progress", "Health", "Current record"]}
        rows={teams.map((team) => [
          team.name,
          team.lead,
          <StatusBadge key={`${team.id}-status`} status={team.status} />,
          <ProgressMeter key={`${team.id}-progress`} value={team.progress} />,
          `${team.deliveryHealth}%`,
          team.currentRecord,
        ])}
      />
    </PageFrame>
  )
}

function ContributionAnalyticsPage({
  selectedTeam,
  onSelectTeam,
}: {
  selectedTeam: Team
  onSelectTeam: (team: string) => void
}) {
  return (
    <PageFrame>
      <TeamPicker
        selectedTeam={selectedTeam}
        onSelectTeam={onSelectTeam}
        label="Contribution records"
      />
      <TeamDetail team={selectedTeam} mode="contribution" />
    </PageFrame>
  )
}

function QuickCreatePage() {
  const teamLeads = employees.filter((employee) => employee.role === "Team Lead")
  const teamMembers = employees.filter((employee) => employee.role === "Team Member")
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [projectName, setProjectName] = React.useState("")
  const [repoUrl, setRepoUrl] = React.useState("")
  const [projectBrief, setProjectBrief] = React.useState("")
  const [assignmentMode, setAssignmentMode] = React.useState<"existing" | "new">("existing")
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0].id)
  const [newTeamName, setNewTeamName] = React.useState("")
  const [selectedLead, setSelectedLead] = React.useState(teamLeads[0]?.id ?? "")
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([
    teamMembers[0]?.id,
    teamMembers[1]?.id,
  ].filter(Boolean))
  const [deadline, setDeadline] = React.useState("")
  const [attemptedDetails, setAttemptedDetails] = React.useState(false)
  const [attemptedAssignment, setAttemptedAssignment] = React.useState(false)
  const [attemptedDeadline, setAttemptedDeadline] = React.useState(false)

  const selectedTeamRecord = teams.find((team) => team.id === selectedTeam) ?? teams[0]
  const selectedLeadRecord = employees.find((employee) => employee.id === selectedLead)
  const selectedMemberRecords = selectedMembers
    .map((memberId) => employees.find((employee) => employee.id === memberId))
    .filter(Boolean) as Employee[]
  const detailsComplete = Boolean(projectName.trim() && repoUrl.trim() && projectBrief.trim())
  const newTeamComplete = Boolean(newTeamName.trim() && selectedLead && selectedMembers.length > 0)
  const assignmentComplete = assignmentMode === "existing" ? Boolean(selectedTeam) : Boolean(newTeamComplete)

  const toggleMember = (employeeId: string, checked: boolean) => {
    setSelectedMembers((currentMembers) =>
      checked
        ? Array.from(new Set([...currentMembers, employeeId]))
        : currentMembers.filter((member) => member !== employeeId)
    )
  }

  const resetFlow = () => {
    setStep(1)
    setProjectName("")
    setRepoUrl("")
    setProjectBrief("")
    setAssignmentMode("existing")
    setSelectedTeam(teams[0].id)
    setNewTeamName("")
    setSelectedLead(teamLeads[0]?.id ?? "")
    setSelectedMembers([teamMembers[0]?.id, teamMembers[1]?.id].filter(Boolean))
    setDeadline("")
    setAttemptedDetails(false)
    setAttemptedAssignment(false)
    setAttemptedDeadline(false)
  }

  const goToAssignment = () => {
    setAttemptedDetails(true)

    if (!detailsComplete) {
      return
    }

    setStep(2)
  }

  const goToDeadline = () => {
    setAttemptedAssignment(true)

    if (!assignmentComplete) {
      return
    }

    setStep(3)
  }

  const handleAssignProject = () => {
    setAttemptedDeadline(true)

    if (!deadline || !assignmentComplete) {
      return
    }

    toast.success("Assigned successfully", {
      description: `${projectName || "Project"} is now assigned.`,
    })

    window.setTimeout(() => {
      pushAdminPage("dashboard")
      window.dispatchEvent(new PopStateEvent("popstate"))
    }, 900)
  }

  return (
    <PageFrame>
      <Card className="mx-auto w-full max-w-4xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardDescription>Project assignment flow</CardDescription>
          <CardTitle className="text-balance text-2xl">
            Create project and assign a team
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              <SparklesIcon data-icon="inline-start" />
              Step {step} of 3
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-6">
          <QuickCreateProgress step={step} />

          {step === 1 ? (
            <FieldSet>
              <FieldLegend>Project details</FieldLegend>
              <FieldDescription>
                Add the project name, repository, and brief before selecting a team.
              </FieldDescription>
              <FieldGroup className="@container/field-group">
                <FieldGroup className="grid gap-4 @2xl/field-group:grid-cols-2">
                  <Field data-invalid={attemptedDetails && !projectName.trim()}>
                    <FieldLabel htmlFor="project-name">Project name</FieldLabel>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(event) => setProjectName(event.target.value)}
                      placeholder="Billing rules workbench"
                      aria-invalid={attemptedDetails && !projectName.trim()}
                    />
                    {attemptedDetails && !projectName.trim() ? (
                      <FieldDescription>Project name is required.</FieldDescription>
                    ) : null}
                  </Field>
                  <Field data-invalid={attemptedDetails && !repoUrl.trim()}>
                    <FieldLabel htmlFor="github-repo">Project repository</FieldLabel>
                    <div className="relative">
                      <GitBranchIcon className="pointer-events-none absolute left-2.5 top-2 text-muted-foreground" />
                      <Input
                        id="github-repo"
                        className="pl-8"
                        value={repoUrl}
                        onChange={(event) => setRepoUrl(event.target.value)}
                        placeholder="https://github.com/atrifex/project"
                        type="url"
                        aria-invalid={attemptedDetails && !repoUrl.trim()}
                      />
                    </div>
                    {attemptedDetails && !repoUrl.trim() ? (
                      <FieldDescription>Repository link is required.</FieldDescription>
                    ) : null}
                  </Field>
                </FieldGroup>
                <Field data-invalid={attemptedDetails && !projectBrief.trim()}>
                  <FieldLabel htmlFor="project-summary">Brief</FieldLabel>
                  <Textarea
                    id="project-summary"
                    className="min-h-24 resize-none"
                    value={projectBrief}
                    onChange={(event) => setProjectBrief(event.target.value)}
                    placeholder="Describe the goal, scope, risks, and first delivery expectation."
                    aria-invalid={attemptedDetails && !projectBrief.trim()}
                  />
                  {attemptedDetails && !projectBrief.trim() ? (
                    <FieldDescription>Brief is required.</FieldDescription>
                  ) : null}
                </Field>
              </FieldGroup>
              <StepActions
                canNext={Boolean(detailsComplete)}
                onNext={goToAssignment}
                onReject={resetFlow}
              />
            </FieldSet>
          ) : null}

          {step === 2 ? (
            <FieldSet>
              <FieldLegend>Team assignment</FieldLegend>
              <FieldDescription>
                Choose an existing team or create a new team from the employee directory.
              </FieldDescription>
              <ToggleGroup
                type="single"
                value={assignmentMode}
                onValueChange={(value) => {
                  if (value) {
                    setAssignmentMode(value as "existing" | "new")
                  }
                }}
                className="grid w-full grid-cols-2"
                variant="outline"
              >
                <ToggleGroupItem value="existing" className="h-10">
                  Existing team
                </ToggleGroupItem>
                <ToggleGroupItem value="new" className="h-10">
                  Create new team
                </ToggleGroupItem>
              </ToggleGroup>

              {assignmentMode === "existing" ? (
                <FieldGroup>
                  <Field>
                    <FieldLabel>Choose team</FieldLabel>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      {selectedTeamRecord.lead} leads this team with {selectedTeamRecord.members.length} active members.
                    </FieldDescription>
                  </Field>
                  <AssignmentSummary
                    lead={employees.find((employee) => employee.name === selectedTeamRecord.lead)}
                    members={employees.filter((employee) =>
                      selectedTeamRecord.members.some((member) => member.name === employee.name)
                    )}
                    teamName={selectedTeamRecord.name}
                  />
                </FieldGroup>
              ) : (
                <FieldGroup>
                  <FieldGroup className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <Field data-invalid={attemptedAssignment && !newTeamName.trim()}>
                      <FieldLabel htmlFor="new-team-name">New team name</FieldLabel>
                      <Input
                        id="new-team-name"
                        value={newTeamName}
                        onChange={(event) => setNewTeamName(event.target.value)}
                        placeholder="Revenue Systems"
                        aria-invalid={attemptedAssignment && !newTeamName.trim()}
                      />
                      {attemptedAssignment && !newTeamName.trim() ? (
                        <FieldDescription>Team name is required.</FieldDescription>
                      ) : null}
                    </Field>
                    <Field>
                      <FieldLabel>Team lead</FieldLabel>
                      <Select value={selectedLead} onValueChange={setSelectedLead}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a lead" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {teamLeads.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name} - {employee.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <EmployeeSelectionList
                    selectedMembers={selectedMembers}
                    onToggleMember={toggleMember}
                  />
                  {attemptedAssignment && selectedMembers.length === 0 ? (
                    <p className="text-sm text-destructive">
                      Select at least one team member.
                    </p>
                  ) : null}
                  <AssignmentSummary
                    lead={selectedLeadRecord}
                    members={selectedMemberRecords}
                    teamName={newTeamName || "New team draft"}
                  />
                </FieldGroup>
              )}

              <StepActions
                canNext={assignmentComplete}
                onBack={() => setStep(1)}
                onNext={goToDeadline}
                onReject={resetFlow}
              />
            </FieldSet>
          ) : null}

          {step === 3 ? (
            <FieldSet>
              <FieldLegend>Deadline and final action</FieldLegend>
              <FieldDescription>
                Add the delivery deadline before assigning this project to the selected team.
              </FieldDescription>
              <FieldGroup className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <Field data-invalid={attemptedDeadline && !deadline}>
                  <FieldLabel htmlFor="deadline">Delivery deadline</FieldLabel>
                  <Input
                    id="deadline"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                    type="date"
                    aria-invalid={attemptedDeadline && !deadline}
                  />
                  {attemptedDeadline && !deadline ? (
                    <FieldDescription>Delivery deadline is required.</FieldDescription>
                  ) : null}
                </Field>
                <AssignmentSummary
                  lead={
                    assignmentMode === "existing"
                      ? employees.find((employee) => employee.name === selectedTeamRecord.lead)
                      : selectedLeadRecord
                  }
                  members={
                    assignmentMode === "existing"
                      ? employees.filter((employee) =>
                          selectedTeamRecord.members.some((member) => member.name === employee.name)
                        )
                      : selectedMemberRecords
                  }
                  teamName={assignmentMode === "existing" ? selectedTeamRecord.name : newTeamName || "New team draft"}
                />
              </FieldGroup>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="destructive" onClick={resetFlow}>
                  <AlertTriangleIcon data-icon="inline-start" />
                  Reject
                </Button>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleAssignProject}>
                    <CheckCircle2Icon data-icon="inline-start" />
                    Assign project
                  </Button>
                </div>
              </div>
            </FieldSet>
          ) : null}
        </CardContent>
      </Card>
    </PageFrame>
  )
}

function ProjectsPage() {
  const projects = teams.flatMap((team) =>
    team.tasks.map((task) => ({
      ...task,
      team: team.name,
      lead: team.lead,
      health: team.deliveryHealth,
    }))
  )

  return (
    <PageFrame>
      <MetricGrid
        metrics={[
          { label: "Active project lanes", value: projects.length.toString(), detail: "Task groups currently owned", icon: BookOpenCheckIcon },
          { label: "Ready for release", value: projects.filter((project) => project.status === "Ready").length.toString(), detail: "Validated tasks", icon: CheckCircle2Icon },
          { label: "In review", value: projects.filter((project) => project.status === "Review").length.toString(), detail: "PR and QA checkpoints", icon: SearchCheckIcon },
          { label: "Blocked", value: projects.filter((project) => project.status === "Blocked").length.toString(), detail: "Needs admin attention", icon: AlertTriangleIcon },
        ]}
      />
      <RecordTable
        title="Project work register"
        description="Project work is grouped dynamically from team task records."
        columns={["Project", "Team", "Lead", "Status", "Progress", "Health"]}
        rows={projects.map((project) => [
          project.name,
          project.team,
          project.lead,
          project.status,
          <ProgressMeter key={project.name} value={project.progress} />,
          `${project.health}%`,
        ])}
      />
    </PageFrame>
  )
}

function TeamsPage({
  selectedTeam,
  onSelectTeam,
}: {
  selectedTeam: Team
  onSelectTeam: (team: string) => void
}) {
  return (
    <PageFrame>
      <TeamPicker selectedTeam={selectedTeam} onSelectTeam={onSelectTeam} label="Team directory" />
      <TeamDetail team={selectedTeam} mode="team" />
    </PageFrame>
  )
}

function GithubSignalsPage() {
  const contributorRows = teams.flatMap((team) =>
    team.members.map((member, index) => [
      member.name,
      team.name,
      member.role,
      Math.round(team.github.commits / team.members.length + index * 3).toString(),
      Math.round(team.github.pullRequests / team.members.length + index).toString(),
      Math.round(team.github.reviews / team.members.length + index * 2).toString(),
    ])
  )

  return (
    <PageFrame>
      <MetricGrid
        metrics={[
          { label: "Connected repos", value: teams.reduce((sum, team) => sum + team.repositories, 0).toString(), detail: "Activated by team", icon: GitBranchIcon },
          { label: "Commits", value: teams.reduce((sum, team) => sum + team.github.commits, 0).toLocaleString(), detail: "Current reporting window", icon: GitCommitHorizontalIcon },
          { label: "Pull requests", value: teams.reduce((sum, team) => sum + team.github.pullRequests, 0).toString(), detail: "Opened and merged", icon: GitPullRequestIcon },
          { label: "Issues raised", value: teams.reduce((sum, team) => sum + team.github.issues, 0).toString(), detail: "Bugs, chores, and risks", icon: RadioTowerIcon },
        ]}
      />
      <Card>
        <CardHeader>
          <CardDescription>Repository activation</CardDescription>
          <CardTitle>GitHub activity by team</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={githubChartConfig} className="h-[300px] w-full">
            <BarChart data={teams.map((team) => ({ team: team.name, commits: team.github.commits }))}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="team" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="commits" fill="var(--color-commits)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <RecordTable
        title="Individual GitHub signal"
        description="Commits, pull requests, and reviews split across contributors."
        columns={["Contributor", "Team", "Role", "Commits", "PRs", "Reviews"]}
        rows={contributorRows}
      />
    </PageFrame>
  )
}

function ExecutiveReportsPage() {
  return (
    <PageFrame>
      <MetricGrid
        metrics={[
          { label: "Reports generated", value: teams.length.toString(), detail: "From team leads to managers", icon: FileChartColumnIcon },
          { label: "Submitted", value: teams.filter((team) => team.reports.status === "Submitted").length.toString(), detail: "Available for executive review", icon: BadgeCheckIcon },
          { label: "Needs update", value: teams.filter((team) => team.reports.status !== "Submitted").length.toString(), detail: "Pending lead revision", icon: Clock3Icon },
          { label: "Weekly cadence", value: teams.filter((team) => team.reports.cadence === "Weekly").length.toString(), detail: "Recurring manager briefings", icon: CalendarClockIcon },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardDescription>{team.lead} to {team.reports.sentTo}</CardDescription>
              <CardTitle>{team.reports.title}</CardTitle>
              <CardAction>
                <StatusBadge status={team.reports.status} />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-sm">
                <MetricChip label="Progress" value={`${team.progress}%`} />
                <MetricChip label="Performance" value={`${team.performance}%`} />
                <MetricChip label="Health" value={`${team.deliveryHealth}%`} />
              </div>
              <p className="text-pretty text-sm text-muted-foreground">
                {team.currentRecord} {team.pastRecord}
              </p>
            </CardContent>
            <CardFooter className="justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{team.reports.cadence} cadence</span>
              <span className="font-medium">{team.name}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageFrame>
  )
}

function EmployeeDirectoryPage() {
  const teamLeads = employees.filter((employee) => employee.role === "Team Lead")
  const teamMembers = employees.filter((employee) => employee.role === "Team Member")

  return (
    <div className="mx-4 flex h-[calc(100vh-var(--header-height))] w-[calc(100vw-3rem)] min-h-0 flex-col gap-4 overflow-hidden py-4 md:w-auto lg:mx-6">
      <div className="shrink-0">
        <MetricGrid
          metrics={[
            { label: "Team leads", value: teamLeads.length.toString(), detail: "Available for project ownership", icon: ShieldCheckIcon },
            { label: "Team members", value: teamMembers.length.toString(), detail: "Assignable contributors", icon: UsersIcon },
            { label: "Available now", value: employees.filter((employee) => employee.availability === "Available").length.toString(), detail: "Low enough load for new work", icon: CheckCircle2Icon },
            { label: "Limited capacity", value: employees.filter((employee) => employee.availability === "Limited").length.toString(), detail: "Needs manager review", icon: AlertTriangleIcon },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1">
        <EmployeeDirectory />
      </div>
    </div>
  )
}

function QuickCreateProgress({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { value: 1, label: "Project" },
    { value: 2, label: "Team" },
    { value: 3, label: "Deadline" },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((item) => (
        <div
          key={item.value}
          className={cn(
            "rounded-lg bg-muted/35 px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-[background-color,box-shadow]",
            step === item.value &&
              "bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
          )}
        >
          <p className="text-xs text-muted-foreground">Step {item.value}</p>
          <p className="text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function StepActions({
  canNext,
  onBack,
  onNext,
  onReject,
}: {
  canNext: boolean
  onBack?: () => void
  onNext: () => void
  onReject: () => void
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button type="button" variant="destructive" onClick={onReject}>
        <AlertTriangleIcon data-icon="inline-start" />
        Reject
      </Button>
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : null}
        <Button type="button" aria-disabled={!canNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}

function EmployeeSelectionList({
  selectedMembers,
  onToggleMember,
}: {
  selectedMembers: string[]
  onToggleMember: (employeeId: string, checked: boolean) => void
}) {
  const teamMembers = employees.filter((employee) => employee.role === "Team Member")

  return (
    <FieldSet>
      <FieldLegend variant="label">Employee directory</FieldLegend>
      <FieldDescription>
        Select members for the new team. Their current team, domain background, and load are visible here.
      </FieldDescription>
      <div className="max-h-[20rem] overflow-auto rounded-lg bg-muted/20 p-2 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
        <FieldGroup className="grid gap-2 md:grid-cols-2">
          {teamMembers.map((employee) => (
            <Field
              key={employee.id}
              orientation="horizontal"
              className="rounded-md bg-background/70 p-3 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-[background-color,box-shadow] has-data-checked:bg-primary/10"
            >
              <Checkbox
                id={`member-${employee.id}`}
                checked={selectedMembers.includes(employee.id)}
                onCheckedChange={(checked) =>
                  onToggleMember(employee.id, checked === true)
                }
              />
              <FieldContent>
                <FieldLabel htmlFor={`member-${employee.id}`}>
                  {employee.name}
                </FieldLabel>
                <FieldDescription>
                  {employee.title} in {employee.team}. {employee.domains.slice(0, 2).join(", ")}.
                </FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>
      </div>
    </FieldSet>
  )
}

function AssignmentSummary({
  lead,
  members,
  teamName,
}: {
  lead?: Employee
  members: Employee[]
  teamName: string
}) {
  return (
    <div className="rounded-lg bg-background/70 p-4 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_45px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{teamName}</p>
          <p className="text-sm text-muted-foreground">
            {lead ? `${lead.name} assigned as lead` : "Lead not selected"}
          </p>
        </div>
        <Badge variant="outline">{members.length} members</Badge>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-3">
        {lead ? <EmployeeMiniCard employee={lead} emphasis="Lead" /> : null}
        {members.slice(0, 4).map((member) => (
          <EmployeeMiniCard key={member.id} employee={member} emphasis="Member" />
        ))}
        {members.length > 4 ? (
          <p className="text-xs text-muted-foreground">
            +{members.length - 4} more selected contributors
          </p>
        ) : null}
      </div>
    </div>
  )
}

function EmployeeDirectory() {
  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CardHeader>
        <CardDescription>Employee directory</CardDescription>
        <CardTitle className="text-balance">Team leads and team members</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Current team</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium">{employee.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {employee.title}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.role === "Team Lead" ? "default" : "secondary"}>
                    {employee.role}
                  </Badge>
                </TableCell>
                <TableCell>{employee.team}</TableCell>
                <TableCell>
                  <div className="flex max-w-72 flex-col gap-1">
                    <span className="text-sm">
                      {employee.previousLeadOf
                        ? `Led ${employee.previousLeadOf}`
                        : `Worked on ${employee.previousContributorOf[0]}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {employee.domains.join(", ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex min-w-32 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={employee.availability} />
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {employee.load}%
                      </span>
                    </div>
                    <ProgressMeter value={employee.load} label="Load" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function EmployeeMiniCard({
  employee,
  emphasis,
}: {
  employee: Employee
  emphasis: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-muted/35 p-3">
      <Avatar>
        <AvatarFallback>{initials(employee.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{employee.name}</p>
          <Badge variant="secondary">{emphasis}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{employee.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {employee.domains.slice(0, 2).join(", ")}
        </p>
      </div>
    </div>
  )
}

function TeamPicker({
  selectedTeam,
  onSelectTeam,
  label,
}: {
  selectedTeam: Team
  onSelectTeam: (team: string) => void
  label: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle>Teams under admin ownership</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => onSelectTeam(team.id)}
            className={cn(
              "flex min-h-40 flex-col justify-between gap-4 rounded-lg bg-muted/35 p-4 text-left shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_45px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,transform] hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96]",
              selectedTeam.id === team.id && "bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_60%,transparent),0_20px_50px_rgba(0,0,0,0.22)]"
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-base font-medium">{team.name}</span>
                <span className="block text-sm text-muted-foreground">Lead: {team.lead}</span>
              </span>
              <StatusBadge status={team.status} />
            </span>
            <span className="flex flex-col gap-2">
              <ProgressMeter value={team.progress} label="Progress" />
              <span className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span><span className="block font-medium text-foreground tabular-nums">{team.members.length}</span>Members</span>
                <span><span className="block font-medium text-foreground tabular-nums">{team.tasks.length}</span>Tasks</span>
                <span><span className="block font-medium text-foreground tabular-nums">{team.performance}%</span>Score</span>
              </span>
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

function TeamDetail({ team, mode }: { team: Team; mode: "team" | "contribution" }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
      <Card>
        <CardHeader>
          <CardDescription>{mode === "team" ? "Team record" : "Contribution record"}</CardDescription>
          <CardTitle className="text-balance text-2xl">{team.name}</CardTitle>
          <CardAction>
            <StatusBadge status={team.status} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <AvatarGroup>
              {team.members.slice(0, 4).map((member) => (
                <Avatar key={member.name}>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <div className="min-w-0">
              <p className="font-medium">{team.lead}</p>
              <p className="text-sm text-muted-foreground">Team lead reporting to {team.manager}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-3">
            <ProgressMeter value={team.progress} label="Current progress" />
            <ProgressMeter value={team.performance} label="Overall performance" />
            <ProgressMeter value={team.deliveryHealth} label="Delivery health" />
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm font-medium">Current record</p>
            <p className="mt-1 text-pretty text-sm text-muted-foreground">{team.currentRecord}</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm font-medium">Past record</p>
            <p className="mt-1 text-pretty text-sm text-muted-foreground">{team.pastRecord}</p>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="members">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <RecordTable
            title="Team members"
            description="Assigned work and individual progress."
            columns={["Member", "Role", "Open tasks", "Progress"]}
            rows={team.members.map((member) => [
              member.name,
              member.role,
              member.tasks.toString(),
              <ProgressMeter key={member.name} value={member.progress} />,
            ])}
          />
        </TabsContent>
        <TabsContent value="tasks">
          <RecordTable
            title="Assigned tasks"
            description="Task ownership and completion state."
            columns={["Task", "Owner", "Status", "Progress"]}
            rows={team.tasks.map((task) => [
              task.name,
              task.owner,
              task.status,
              <ProgressMeter key={task.name} value={task.progress} />,
            ])}
          />
        </TabsContent>
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardDescription>Current and past sprint record</CardDescription>
              <CardTitle>{team.name} delivery curve</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={deliveryChartConfig} className="h-[320px] w-full">
                <AreaChart data={team.trend}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="sprint" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="delivery" type="natural" fill="var(--color-delivery)" fillOpacity={0.22} stroke="var(--color-delivery)" />
                  <Area dataKey="quality" type="natural" fill="var(--color-quality)" fillOpacity={0.16} stroke="var(--color-quality)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricGrid({
  metrics,
}: {
  metrics: { label: string; value: string; detail: string; icon: React.ElementType }[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                {metric.value}
              </CardTitle>
              <CardAction>
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon />
                </span>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">{metric.detail}</CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

function SignalRail({ team }: { team: Team }) {
  return (
    <div className="rounded-lg bg-muted/35 p-4 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{team.name}</p>
          <p className="text-sm text-muted-foreground">Lead: {team.lead}</p>
        </div>
        <StatusBadge status={team.status} />
      </div>
      <div className="mt-4 grid gap-3">
        <ProgressMeter value={team.deliveryHealth} label="Health" />
        <ProgressMeter value={team.progress} label="Progress" />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
        <MetricChip label="Commits" value={team.github.commits.toString()} />
        <MetricChip label="PRs" value={team.github.pullRequests.toString()} />
        <MetricChip label="Issues" value={team.github.issues.toString()} />
        <MetricChip label="Reviews" value={team.github.reviews.toString()} />
      </div>
    </div>
  )
}

function RecordTable({
  title,
  description,
  columns,
  rows,
}: {
  title: string
  description: string
  columns: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={`${title}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={`${title}-${rowIndex}-${cellIndex}`}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ProgressMeter({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex min-w-36 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{label ?? "Progress"}</span>
        <span className="font-medium text-foreground tabular-nums">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="min-w-0 rounded-md bg-background/60 px-2 py-1.5">
      <span className="block truncate text-[0.7rem] text-muted-foreground">{label}</span>
      <span className="block truncate font-medium text-foreground tabular-nums">{value}</span>
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Submitted" || status === "Active" ? "default" : status === "Watch" || status === "Needs update" ? "outline" : "secondary"

  return <Badge variant={variant}>{status}</Badge>
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 flex w-[calc(100vw-3rem)] flex-col gap-4 py-4 md:w-auto md:gap-6 md:py-6 lg:mx-6">
      {children}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}
