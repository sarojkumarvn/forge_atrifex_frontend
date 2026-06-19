import { useMemo, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ActivityIcon,
  BarChart3Icon,
  BellIcon,
  CheckCircle2Icon,
  CircleUserRoundIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react"
import { toast } from "sonner"

type Availability = "active" | "inactive" | "focus"
type ThemeChoice = "light" | "dark" | "system"

const profileStorageKey = "atrifex-profile-preferences"

const analyticsHistory = [
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
]

const availabilityCopy: Record<Availability, { label: string; detail: string }> = {
  active: {
    label: "Active",
    detail: "Available for reviews, approvals, and dashboard alerts.",
  },
  focus: {
    label: "Focus",
    detail: "Only critical delivery and project assignment alerts are shown.",
  },
  inactive: {
    label: "Inactive",
    detail: "Status is hidden from active assignment workflows.",
  },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getSavedProfilePreferences() {
  const savedPreferences = window.localStorage.getItem(profileStorageKey)
  if (!savedPreferences) return null

  try {
    return JSON.parse(savedPreferences) as {
      availability?: Availability
      themeChoice?: ThemeChoice
    }
  } catch {
    window.localStorage.removeItem(profileStorageKey)
    return null
  }
}

function getInitialAvailability(): Availability {
  return getSavedProfilePreferences()?.availability ?? "active"
}

function getInitialThemeChoice(): ThemeChoice {
  return (
    getSavedProfilePreferences()?.themeChoice ??
    ((window.localStorage.getItem("atrifex-theme") as ThemeChoice | null) ?? "dark")
  )
}

function applyDashboardTheme(theme: ThemeChoice) {
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  document.documentElement.classList.toggle("light", resolvedTheme === "light")
  window.localStorage.setItem("atrifex-theme", resolvedTheme)
}

export function NavUser({
  user,
  dashboardBasePath = "/admin/dashboard",
}: {
  user: {
    name: string
    email: string
    avatar: string
    position?: string
    team?: string
  }
  dashboardBasePath?: string
}) {
  const { isMobile } = useSidebar()
  const [profileOpen, setProfileOpen] = useState(false)
  const [availability, setAvailability] = useState<Availability>(getInitialAvailability)
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>(getInitialThemeChoice)
  const initials = useMemo(() => getInitials(user.name), [user.name])
  const profileDetails = {
    position: user.position ?? "Delivery Operations Manager",
    team: user.team ?? "Admin command center",
    employeeId: "AFX-ADM-001",
    lastActive: "Jun 20, 2026, 11:42 AM",
  }

  function handleThemeChange(value: string) {
    if (!value) return
    const nextTheme = value as ThemeChoice

    setThemeChoice(nextTheme)
    applyDashboardTheme(nextTheme)
    window.localStorage.setItem(
      profileStorageKey,
      JSON.stringify({ availability, themeChoice: nextTheme })
    )
    toast.success("Theme updated")
  }

  function handleAvailabilityChange(value: Availability) {
    setAvailability(value)
    window.localStorage.setItem(
      profileStorageKey,
      JSON.stringify({ availability: value, themeChoice })
    )
    toast.success(`Profile set to ${availabilityCopy[value].label}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={`${dashboardBasePath}/profile`}>
                <CircleUserRoundIcon
                />
                See profile
                <Badge variant="secondary" className="ml-auto">
                  {availabilityCopy[availability].label}
                </Badge>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`${dashboardBasePath}/settings`}>
                <CreditCardIcon
                />
                Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon
                />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent className="w-full overflow-hidden p-0 sm:max-w-xl">
            <SheetHeader className="border-b">
              <div className="flex items-start gap-3 pr-10">
                <Avatar className="size-11 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <SheetTitle className="truncate">{user.name}</SheetTitle>
                  <SheetDescription className="truncate">
                    {profileDetails.position} · {profileDetails.team}
                  </SheetDescription>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={availability === "inactive" ? "outline" : "secondary"}>
                      {availabilityCopy[availability].label}
                    </Badge>
                    <Badge variant="outline">{profileDetails.employeeId}</Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>
            <Tabs defaultValue="profile" className="min-h-0 flex-1 overflow-hidden px-4 pb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-4 h-[calc(100vh-13rem)] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Identity</CardTitle>
                      <CardDescription>Current role and operational profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Position</span>
                        <span className="font-medium">{profileDetails.position}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Team</span>
                        <span className="font-medium">{profileDetails.team}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <span className="truncate font-medium">{user.email}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Last active</span>
                        <span className="font-medium">{profileDetails.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Analyses", value: "48", icon: BarChart3Icon },
                      { label: "Approvals", value: "21", icon: CheckCircle2Icon },
                      { label: "Risk notes", value: "09", icon: ShieldCheckIcon },
                    ].map((item) => (
                      <Card key={item.label}>
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <item.icon />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-xl font-semibold tabular-nums">
                              {item.value}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4 h-[calc(100vh-13rem)] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {analyticsHistory.map((item) => (
                    <Card key={`${item.title}-${item.date}`}>
                      <CardContent className="flex gap-3 p-4">
                        <div className="mt-1 flex size-8 items-center justify-center rounded-lg bg-muted">
                          <ActivityIcon />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.scope}</span>
                          <Badge variant="secondary" className="w-fit">
                            {item.result}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4 h-[calc(100vh-13rem)] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Theme changes apply to this dashboard immediately.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ToggleGroup
                        type="single"
                        value={themeChoice}
                        onValueChange={handleThemeChange}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <ToggleGroupItem value="light" aria-label="Light theme">
                          <SunIcon data-icon="inline-start" />
                          Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark theme">
                          <MoonIcon data-icon="inline-start" />
                          Dark
                        </ToggleGroupItem>
                        <ToggleGroupItem value="system" aria-label="System theme">
                          <SparklesIcon data-icon="inline-start" />
                          System
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Availability</CardTitle>
                      <CardDescription>{availabilityCopy[availability].detail}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Select value={availability} onValueChange={handleAvailabilityChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="focus">Focus</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        This status is reflected in the profile menu and can be used by assignment flows.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
