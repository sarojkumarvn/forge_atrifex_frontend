import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ActivityIcon,
  ArrowRightIcon,
  BarChart3Icon,
  BrainCircuitIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleGaugeIcon,
  Code2Icon,
  FolderKanbanIcon,
  GitBranchIcon,
  LineChartIcon,
  MessageCircleIcon,
  MenuIcon,
  MoonIcon,
  NetworkIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  TargetIcon,
  TimerIcon,
  TrendingUpIcon,
  Share2Icon,
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
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AuthPage, DashboardNotFound } from "@/components/auth/auth-pages"
import { cn } from "@/lib/utils"

import "./App.css"

type Theme = "dark" | "light"
type AppView = "landing" | "login-loading" | "login" | "signup-loading" | "signup"

const navItems = ["Features", "Solutions", "Analytics", "Pricing", "About"]

const roleCards = [
  {
    title: "Employee",
    cta: "For Employees",
    icon: Code2Icon,
    summary: "Know what matters today and how your contributions are landing.",
    features: [
      "View assigned tasks",
      "Track deadlines",
      "Connect GitHub",
      "Monitor progress",
      "Receive AI feedback",
    ],
    metric: "42",
    label: "open tasks",
  },
  {
    title: "Team Lead",
    cta: "For Team Leads",
    icon: UsersIcon,
    summary: "Coordinate projects, unblock engineers, and spot delivery risk early.",
    features: [
      "Manage projects",
      "Assign tasks",
      "Track team performance",
      "Monitor deadlines",
      "Generate reports",
    ],
    metric: "91%",
    label: "team focus",
  },
  {
    title: "Manager/Admin",
    cta: "For Managers",
    icon: ShieldCheckIcon,
    summary: "Read health across teams without flattening engineering context.",
    features: [
      "View all teams",
      "Monitor project health",
      "Analyze performance",
      "Track organization KPIs",
      "Generate executive insights",
    ],
    metric: "37",
    label: "active projects",
  },
]

const workflow = [
  { title: "Create Teams", icon: UsersIcon },
  { title: "Assign Projects", icon: FolderKanbanIcon },
  { title: "Break Down Tasks", icon: TargetIcon },
  { title: "Develop & Push Code", icon: GitBranchIcon },
  { title: "Analyze Contributions", icon: BarChart3Icon },
  { title: "Generate AI Insights", icon: BrainCircuitIcon },
  { title: "Deliver Projects Faster", icon: TrendingUpIcon },
]

const metricCards = [
  { label: "Project Progress", value: "89%", icon: CircleGaugeIcon },
  { label: "Team Efficiency", value: "92%", icon: ActivityIcon },
  { label: "Commits This Week", value: "1,248", icon: GitBranchIcon },
  { label: "Tasks Completed", value: "842", icon: CheckIcon },
  { label: "Active Projects", value: "37", icon: FolderKanbanIcon },
]

const areaData = [
  { week: "W1", delivery: 58, health: 61 },
  { week: "W2", delivery: 64, health: 68 },
  { week: "W3", delivery: 72, health: 74 },
  { week: "W4", delivery: 70, health: 79 },
  { week: "W5", delivery: 82, health: 84 },
  { week: "W6", delivery: 89, health: 91 },
]

const barData = [
  { team: "Core", commits: 280 },
  { team: "AI", commits: 342 },
  { team: "Infra", commits: 226 },
  { team: "Apps", commits: 400 },
]

const pieData = [
  { name: "On track", value: 64, fill: "var(--chart-2)" },
  { name: "Watch", value: 24, fill: "var(--chart-1)" },
  { name: "At risk", value: 12, fill: "var(--chart-3)" },
]

const performanceData = [
  { name: "Planning", score: 84 },
  { name: "Review", score: 78 },
  { name: "Velocity", score: 92 },
  { name: "Quality", score: 88 },
]

const areaConfig = {
  delivery: { label: "Completion", color: "var(--chart-1)" },
  health: { label: "Health", color: "var(--chart-2)" },
} satisfies ChartConfig

const barConfig = {
  commits: { label: "Commits", color: "var(--chart-1)" },
} satisfies ChartConfig

const performanceConfig = {
  score: { label: "Score", color: "var(--chart-2)" },
} satisfies ChartConfig

const pricing = [
  {
    name: "Starter",
    description: "For small teams.",
    price: "$19",
    features: [
      "Up to 10 members",
      "Basic analytics",
      "Task management",
      "GitHub integration",
    ],
  },
  {
    name: "Professional",
    description: "For growing companies.",
    price: "$79",
    popular: true,
    features: [
      "Up to 100 members",
      "Advanced analytics",
      "AI insights",
      "Performance reports",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For organizations.",
    price: "Custom",
    features: [
      "Unlimited teams",
      "Custom dashboards",
      "Advanced AI analysis",
      "Dedicated support",
      "SSO",
      "Organization analytics",
    ],
  },
]

const footerGroups = [
  { title: "Product", links: ["Features", "Analytics", "Pricing", "Roadmap"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Blog"] },
  { title: "Resources", links: ["Documentation", "API", "Support", "Community"] },
  { title: "Social", links: ["GitHub", "LinkedIn", "Twitter", "Discord"] },
]

function setDocumentTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.classList.toggle("light", theme === "light")
}

function getInitialView(): AppView {
  if (typeof window === "undefined") {
    return "landing"
  }

  if (window.location.pathname === "/login") {
    return "login"
  }

  if (window.location.pathname === "/signup") {
    return "signup"
  }

  return "landing"
}

function isDashboardPath(path: string) {
  return path === "/dashboard" || path.endsWith("/dashboard")
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark"
    }

    return (window.localStorage.getItem("atrifex-theme") as Theme | null) ?? "dark"
  })
  const [view, setView] = useState<AppView>(getInitialView)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === "undefined") {
      return "/"
    }

    return window.location.pathname
  })

  useEffect(() => {
    setDocumentTheme(theme)
    window.localStorage.setItem("atrifex-theme", theme)
  }, [theme])

  useEffect(() => {
    if (view !== "login-loading" && view !== "signup-loading") {
      return
    }

    const timer = window.setTimeout(() => {
      setView(view === "login-loading" ? "login" : "signup")
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [view])

  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(window.location.pathname)
      setView(getInitialView())
    }

    window.addEventListener("popstate", syncPath)

    return () => window.removeEventListener("popstate", syncPath)
  }, [])

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path)
    setCurrentPath(path)
  }

  const showLogin = () => {
    navigateTo("/login")
    setView("login-loading")
  }

  const showSignup = () => {
    navigateTo("/signup")
    setView("signup-loading")
  }

  const showLanding = () => {
    navigateTo("/")
    setView("landing")
  }

  const redirectToDashboard = (path: string) => {
    navigateTo(path)
    setView("landing")
  }

  if (currentPath === "/admin/dashboard") {
    return <AdminDashboard />
  }

  if (isDashboardPath(currentPath)) {
    return (
      <DashboardNotFound
        onBack={showLanding}
        onShowSignup={showSignup}
        path={currentPath}
        theme={theme}
        onThemeChange={setTheme}
      />
    )
  }

  if (view !== "landing") {
    return (
      <AuthPage
        mode={view}
        onBack={showLanding}
        onRedirect={redirectToDashboard}
        onShowLogin={showLogin}
        onShowSignup={showSignup}
        theme={theme}
        onThemeChange={setTheme}
      />
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader theme={theme} onThemeChange={setTheme} onLoginClick={showLogin} />
      <main>
        <HeroSection />
        <RoleSection />
        <WorkflowSection />
        <AnalyticsSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader({
  theme,
  onThemeChange,
  onLoginClick,
}: {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onLoginClick: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const toggleTheme = () => onThemeChange(theme === "dark" ? "light" : "dark")
  const openLogin = () => {
    setMobileMenuOpen(false)
    onLoginClick()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 sm:px-5">
      <div className="flex h-16 w-full max-w-4xl items-center justify-between rounded-b-[1.75rem] border border-t-0 border-border/80 bg-card/90 px-3 text-card-foreground shadow-[0_24px_80px_rgba(0,0,0,0.18),0_0_60px_color-mix(in_oklab,var(--primary)_18%,transparent)] backdrop-blur-xl sm:px-4">
        <a href="#" className="flex min-h-10 items-center gap-3 rounded-2xl pr-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-b from-primary to-accent text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_0_28px_rgba(0,229,255,0.28)]">
            <SparklesIcon />
          </span>
          <span className="text-base font-semibold text-foreground">AtriFex</span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className="min-h-10 content-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button className="text-muted-foreground hover:text-foreground" variant="ghost" onClick={openLogin}>
            Login
          </Button>
          <Button className="rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_30px_color-mix(in_oklab,var(--primary)_20%,transparent)] transition-transform duration-200 active:scale-[0.96]" asChild>
            <a href="#pricing">
              Get Started
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
          <ThemeToggle theme={theme} onClick={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button className="rounded-2xl transition-transform duration-200 active:scale-[0.96]" onClick={openLogin}>
            Login
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button className="border-border/80 bg-background/30 hover:bg-muted/70" variant="outline" size="icon-lg" aria-label="Open navigation">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-border/80 bg-background/95">
              <SheetHeader>
                <SheetTitle>AtriFex Forge</SheetTitle>
                <SheetDescription>Navigate the platform overview.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <a
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    href={`#${item.toLowerCase()}`}
                    key={item}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 p-4">
                <ThemeToggle theme={theme} onClick={toggleTheme} />
                <Button variant="outline" onClick={openLogin}>
                  Login
                </Button>
                <Button className="active:scale-[0.96] transition-transform duration-200" asChild>
                  <a href="#pricing">Get Started</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <Button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="relative active:scale-[0.96] transition-transform duration-200"
      onClick={onClick}
      size="icon-lg"
      variant="outline"
    >
      <SunIcon
        className={cn(
          "absolute transition-[opacity,scale,filter] duration-300",
          theme === "light" ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
        )}
      />
      <MoonIcon
        className={cn(
          "transition-[opacity,scale,filter] duration-300",
          theme === "dark" ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
        )}
      />
    </Button>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-28 sm:px-8" id="features">
      <HeroAtmosphere />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <Reveal className="flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-[0_0_40px_rgba(0,229,255,0.08)] backdrop-blur">
          <SparklesIcon className="text-primary" />
          AI-powered engineering management
        </Reveal>

        <div className="flex max-w-5xl flex-col gap-4">
          <Reveal delay={0.08}>
            <h1 className="text-balance text-6xl font-semibold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
              <span className="block text-foreground/25">The future</span>
              <span className="block text-foreground/30">of engineering</span>
              <span className="block">
                is <span className="text-primary">Contribution</span> +{" "}
                <span className="hero-spark inline-grid place-items-center text-accent">✦</span>{" "}
                intelligence
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Manage projects, track developer contributions, analyze GitHub
              activity, and gain AI-powered insights into your team's performance.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.24} className="flex flex-col items-center gap-3 sm:flex-row">
          <Button className="h-12 min-w-40 active:scale-[0.96] transition-transform duration-200" size="lg" asChild>
            <a href="#pricing">
              Get Started
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
          <Button className="h-12 min-w-40 active:scale-[0.96] transition-transform duration-200" size="lg" variant="outline" asChild>
            <a href="#analytics">
              <PlayIcon data-icon="inline-start" />
              Watch Demo
            </a>
          </Button>
        </Reveal>

        <Reveal delay={0.32} className="w-full max-w-4xl">
          <HeroConsole />
        </Reveal>
      </div>
    </section>
  )
}

function HeroAtmosphere() {
  const particles = useMemo(() => Array.from({ length: 34 }, (_, index) => index), [])

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_36rem)]" />
      <motion.div
        animate={{ opacity: [0.24, 0.42, 0.24], scale: [1, 1.05, 1] }}
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {particles.map((item) => (
        <motion.span
          className="absolute size-1 rounded-full bg-primary/60"
          animate={{ opacity: [0.1, 0.75, 0.1], y: [-8, 8, -8] }}
          key={item}
          style={{
            left: `${(item * 29) % 100}%`,
            top: `${18 + ((item * 17) % 70)}%`,
          }}
          transition={{
            delay: item * 0.12,
            duration: 3.5 + (item % 5),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

function HeroConsole() {
  return (
    <Card className="border-border/80 bg-card/75 text-left shadow-[0_30px_100px_rgba(0,0,0,0.45),0_0_80px_rgba(0,229,255,0.12)] backdrop-blur">
      <CardContent>
        <Card className="border-border/70 bg-background/80">
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-destructive" />
                <span className="size-3 rounded-full bg-primary" />
                <span className="size-3 rounded-full bg-accent" />
              </div>
              <Badge variant="secondary">Live engineering graph</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <CardTitle className="font-mono text-4xl font-semibold tabular-nums">94.2</CardTitle>
                  <CardDescription>Project health score</CardDescription>
                  <CardAction>
                    <LineChartIcon className="text-primary" />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="flex h-28 items-end gap-2">
                    {[42, 58, 52, 74, 67, 88, 82, 96, 91, 99, 93, 100].map((height, index) => (
                      <motion.span
                        className="flex-1 rounded-t-md bg-primary/70"
                        initial={{ height: 12 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.04, duration: 0.45, ease: "easeOut" }}
                        key={height + index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-3">
                {["Risk detection", "Review velocity", "AI summary"].map((item, index) => (
                  <Card className="border-border/70 bg-card/80" size="sm" key={item}>
                    <CardHeader>
                      <CardTitle>{item}</CardTitle>
                      <CardAction className="font-mono text-sm tabular-nums text-accent">
                        {91 + index}%
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: "24%" }}
                          whileInView={{ width: `${76 + index * 7}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function RoleSection() {
  return (
    <section className="bg-background px-5 py-24 text-foreground sm:px-8" id="solutions">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionIntro
          eyebrow="Platform roles"
          title="Choose your operating mode"
          accent="mode"
          description="AtriFex Forge changes shape for the people doing the work, leading delivery, and reading organization health."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {roleCards.map((role, index) => (
            <RoleCard role={role} index={index} key={role.title} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RoleCard({ role, index }: { role: (typeof roleCards)[number]; index: number }) {
  const Icon = role.icon

  return (
    <Reveal delay={index * 0.08}>
      <Card className="group min-h-[29rem] border-border/80 bg-card/85 text-card-foreground shadow-[0_18px_70px_rgba(0,0,0,0.22)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,229,255,0.14)]">
        <CardHeader>
          <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-[0_0_30px_rgba(0,229,255,0.18)]">
            <Icon />
          </div>
          <CardTitle className="text-2xl">{role.title}</CardTitle>
          <CardDescription>{role.summary}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <DashboardFragment metric={role.metric} label={role.label} index={index} />
          <ul className="grid gap-3">
            {role.features.map((feature) => (
              <li className="flex items-center gap-3 text-sm text-muted-foreground" key={feature}>
                <CheckIcon className="text-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-border/70 bg-muted/40">
          <Button className="w-full active:scale-[0.96] transition-transform duration-200">
            {role.cta}
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </Reveal>
  )
}

function DashboardFragment({ metric, label, index }: { metric: string; label: string; index: number }) {
  return (
    <Card className="relative border-border/70 bg-background/70">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.24),transparent_70%)]" />
      <CardContent className="relative flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-3xl font-semibold tabular-nums">{metric}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        <div className="flex h-20 w-28 items-end gap-1.5">
          {[38, 62, 48, 72, 86, 58, 92].map((height, item) => (
            <span
              className={cn("flex-1 rounded-t bg-accent/70", item % 2 === index % 2 && "bg-primary/70")}
              style={{ height: `${height}%` }}
              key={height + item}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function WorkflowSection() {
  return (
    <section className="px-5 py-24 sm:px-8" id="about">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <SectionIntro
          eyebrow="How it works"
          title="One workflow from team design to delivery insight"
          description="Every step preserves the context behind engineering work, from task ownership to code activity and AI performance summaries."
        />
        <div className="relative grid gap-4 md:grid-cols-7">
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {workflow.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal delay={index * 0.05} key={step.title}>
                <Card className="relative min-h-40 border-border/80 bg-card/70 shadow-[0_12px_50px_rgba(0,0,0,0.18)]">
                  <CardHeader className="flex flex-row items-center gap-4 md:flex-col md:items-start">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        Step {index + 1}
                      </span>
                      <CardTitle className="text-balance text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AnalyticsSection() {
  return (
    <section className="px-5 py-24 sm:px-8" id="analytics">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionIntro
          eyebrow="Analytics showcase"
          title="Performance context without surveillance theater"
          description="AtriFex Forge turns projects, commits, tasks, and delivery signals into practical management insight."
        />
        <div className="grid gap-5 lg:grid-cols-5">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon

            return (
              <Reveal delay={index * 0.05} key={metric.label}>
                <Card className="border-border/80 bg-card/80 shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
                  <CardHeader>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardAction>
                      <Icon className="text-primary" />
                    </CardAction>
                    <CardTitle className="font-mono text-3xl tabular-nums">{metric.value}</CardTitle>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <Card className="overflow-hidden border-border/80 bg-card/85 shadow-[0_30px_120px_rgba(0,0,0,0.35),0_0_90px_rgba(0,229,255,0.08)]">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <CardTitle className="text-3xl">Engineering command center</CardTitle>
                  <CardDescription>
                    Project health, sprint progress, contributor rankings, deadline risk, and AI performance insights.
                  </CardDescription>
                </div>
                <Badge className="w-fit" variant="secondary">Updated 4 minutes ago</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="grid gap-5">
                <ChartPanel title="Project Completion Rate" icon={TrendingUpIcon}>
                  <ChartContainer className="h-72 w-full" config={areaConfig}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="delivery" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-delivery)" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="var(--color-delivery)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area dataKey="health" stroke="var(--color-health)" fill="transparent" strokeWidth={2} />
                      <Area dataKey="delivery" stroke="var(--color-delivery)" fill="url(#delivery)" strokeWidth={2} type="monotone" />
                    </AreaChart>
                  </ChartContainer>
                </ChartPanel>

                <div className="grid gap-5 md:grid-cols-2">
                  <ChartPanel title="Commit Activity" icon={GitBranchIcon}>
                    <ChartContainer className="h-56 w-full" config={barConfig}>
                      <BarChart data={barData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="team" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="commits" fill="var(--color-commits)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </ChartPanel>

                  <ChartPanel title="Team Performance Graph" icon={NetworkIcon}>
                    <ChartContainer className="h-56 w-full" config={performanceConfig}>
                      <BarChart data={performanceData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={76} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="var(--color-score)" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </ChartPanel>
                </div>
              </div>

              <div className="grid gap-5">
                <ChartPanel title="Deadline Risk Detection" icon={TimerIcon}>
                  <div className="flex items-center justify-center">
                    <ChartContainer className="h-56 w-full max-w-72" config={{ value: { label: "Risk", color: "var(--chart-2)" } }}>
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={88} paddingAngle={4}>
                          {pieData.map((entry) => (
                            <Cell fill={entry.fill} key={entry.name} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                </ChartPanel>

                <Card className="border-border/80 bg-background/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuitIcon className="text-accent" />
                      AI Performance Insights
                    </CardTitle>
                    <CardDescription>Executive summary generated from delivery, task, and GitHub signals.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm text-muted-foreground">
                    {[
                      "Sprint progress is ahead of forecast by 11%.",
                      "Review load is concentrated across two senior engineers.",
                      "Project Phoenix has a deadline risk from unresolved API work.",
                    ].map((insight) => (
                      <Card className="border-border/70 bg-card/60" size="sm" key={insight}>
                        <CardContent className="flex gap-3">
                          <SparklesIcon className="mt-0.5 shrink-0 text-accent" />
                          <p className="text-pretty">{insight}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="px-5 py-24 sm:px-8" id="pricing">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionIntro
          eyebrow="Pricing"
          title="Scale from one squad to the whole organization"
          description="Start with project analytics, then expand into AI insights, executive dashboards, and organization-wide performance views."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {pricing.map((plan, index) => (
            <Reveal delay={index * 0.07} key={plan.name}>
              <Card
                className={cn(
                  "min-h-[31rem] border-border/80 bg-card/80 shadow-[0_18px_70px_rgba(0,0,0,0.18)]",
                  plan.popular && "border-primary/50 shadow-[0_0_90px_rgba(0,229,255,0.12)]"
                )}
              >
                <CardHeader>
                  {plan.popular && (
                    <CardAction>
                      <Badge>Most Popular</Badge>
                    </CardAction>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="font-mono text-5xl font-semibold tabular-nums">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground"> / month</span>}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {plan.features.map((feature) => (
                    <div className="flex items-center gap-3 text-sm" key={feature}>
                      <CheckIcon className="text-accent" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className="w-full active:scale-[0.96] transition-transform duration-200"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/80 px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-semibold">AtriFex Forge</span>
          </div>
          <p className="max-w-sm text-pretty text-sm text-muted-foreground">
            AI-powered engineering management for high-performing teams.
          </p>
          <div className="flex gap-2">
            {[GitBranchIcon, MessageCircleIcon, Share2Icon, BriefcaseBusinessIcon].map((Icon, index) => (
              <Button aria-label={`Social link ${index + 1}`} size="icon-sm" variant="outline" key={index}>
                <Icon />
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div className="flex flex-col gap-4" key={group.title}>
              <h3 className="font-semibold">{group.title}</h3>
              <div className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <a className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground" href="#" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl">
        <Separator />
        <p className="pt-6 text-sm text-muted-foreground">
          © 2026 AtriFex Forge. Built for high-performing engineering teams.
        </p>
      </div>
    </footer>
  )
}

function SectionIntro({
  eyebrow,
  title,
  description,
  accent,
  inverted = false,
}: {
  eyebrow: string
  title: string
  description: string
  accent?: string
  inverted?: boolean
}) {
  const displayTitle = accent ? title.replace(accent, "") : title

  return (
    <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <Badge variant={inverted ? "secondary" : "outline"}>{eyebrow}</Badge>
      <h2 className={cn("text-balance text-4xl font-semibold sm:text-5xl", inverted ? "text-background" : "text-foreground")}>
        {displayTitle}
        {accent && <span className="text-[#1dbf73]">{accent}</span>}
      </h2>
      <p className={cn("text-pretty text-base leading-7", inverted ? "text-background/60" : "text-muted-foreground")}>
        {description}
      </p>
    </Reveal>
  )
}

function ChartPanel({
  children,
  icon: Icon,
  title,
}: {
  children: React.ReactNode
  icon: typeof ActivityIcon
  title: string
}) {
  return (
    <Card className="border-border/80 bg-background/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

function LogoMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(0,229,255,0.14)]">
      <SparklesIcon />
    </span>
  )
}

export default App
