import { useState } from "react"
import {
  ActivityIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UserRoundCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Availability = "active" | "focus" | "inactive"
type ThemeChoice = "light" | "dark" | "system"

export type DashboardUserProfile = {
  name: string
  email: string
  avatar: string
  initials: string
  position: string
  team: string
  employeeId: string
  lastActive: string
  roleLabel: string
  analyticsHistory: Array<{
    title: string
    scope: string
    date: string
    result: string
  }>
  stats: Array<{
    label: string
    value: string
  }>
}

const availabilityCopy: Record<Availability, { label: string; detail: string }> = {
  active: {
    label: "Active",
    detail: "Available for tasks, reviews, messages, and project alerts.",
  },
  focus: {
    label: "Focus",
    detail: "Only priority project and deadline alerts will be shown.",
  },
  inactive: {
    label: "Inactive",
    detail: "Marked away from live assignment and alert workflows.",
  },
}

function getStorageKey(profile: DashboardUserProfile) {
  return `atrifex-profile-${profile.employeeId}`
}

function getSavedPreference<T>(profile: DashboardUserProfile, key: "availability" | "theme", fallback: T) {
  if (typeof window === "undefined") return fallback

  const saved = window.localStorage.getItem(getStorageKey(profile))
  if (!saved) return fallback

  try {
    const parsed = JSON.parse(saved) as Partial<Record<"availability" | "theme", T>>
    return parsed[key] ?? fallback
  } catch {
    window.localStorage.removeItem(getStorageKey(profile))
    return fallback
  }
}

function savePreference(
  profile: DashboardUserProfile,
  availability: Availability,
  theme: ThemeChoice
) {
  window.localStorage.setItem(
    getStorageKey(profile),
    JSON.stringify({ availability, theme })
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

export function DashboardProfilePage({ profile }: { profile: DashboardUserProfile }) {
  const [availability] = useState<Availability>(() =>
    getSavedPreference(profile, "availability", "active")
  )

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12),0_0_70px_color-mix(in_oklab,var(--primary)_10%,transparent)]">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="size-16 rounded-2xl">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="rounded-2xl">{profile.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div>
                  <CardTitle className="truncate text-2xl text-balance">{profile.name}</CardTitle>
                  <CardDescription className="truncate">
                    {profile.position} · {profile.team}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{availabilityCopy[availability].label}</Badge>
                  <Badge variant="outline">{profile.roleLabel}</Badge>
                  <Badge variant="outline">{profile.employeeId}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <ProfileFact label="Email" value={profile.email} />
            <ProfileFact label="Position" value={profile.position} />
            <ProfileFact label="Team" value={profile.team} />
            <ProfileFact label="Last active" value={profile.lastActive} />
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          {profile.stats.map((stat, index) => {
            const Icon = [BarChart3Icon, CheckCircle2Icon, ShieldCheckIcon][index] ?? ActivityIcon

            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <Icon />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-2xl font-semibold tabular-nums">
                      {stat.value}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Analytics history</CardTitle>
          <CardDescription>Recent analysis, reports, and dashboard activity by this user.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {profile.analyticsHistory.map((item) => (
            <div
              className="flex gap-3 rounded-xl bg-muted/60 p-3"
              key={`${item.title}-${item.date}`}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                <ActivityIcon />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.scope}</span>
                <Badge className="w-fit" variant="secondary">
                  {item.result}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardSettingsPage({ profile }: { profile: DashboardUserProfile }) {
  const [availability, setAvailability] = useState<Availability>(() =>
    getSavedPreference(profile, "availability", "active")
  )
  const [theme, setTheme] = useState<ThemeChoice>(() =>
    getSavedPreference(profile, "theme", "dark")
  )

  function handleThemeChange(value: string) {
    if (!value) return

    const nextTheme = value as ThemeChoice
    setTheme(nextTheme)
    applyDashboardTheme(nextTheme)
    savePreference(profile, availability, nextTheme)
    toast.success("Theme updated")
  }

  function handleAvailabilityChange(value: Availability) {
    setAvailability(value)
    savePreference(profile, value, theme)
    toast.success(`Appearance set to ${availabilityCopy[value].label}`)
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <UserRoundCheckIcon />
            </div>
            <div className="min-w-0">
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage theme and visible availability for {profile.name}.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Changes apply to the dashboard immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              className="flex w-full flex-wrap justify-start"
              onValueChange={handleThemeChange}
              type="single"
              value={theme}
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
            <div className="rounded-xl bg-muted/70 p-3 text-sm text-muted-foreground">
              This status is saved and reflected on the profile page for this account.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl bg-muted/60 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  )
}
