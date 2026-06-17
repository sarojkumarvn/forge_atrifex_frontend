import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  GitBranchIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Theme = "dark" | "light"
type AuthMode = "login-loading" | "login" | "signup-loading" | "signup"
type SignupStep = 1 | 2 | 3
type Role = "manager" | "team-lead" | "member"

type AuthPageProps = {
  mode: AuthMode
  onBack: () => void
  onShowLogin: () => void
  onShowSignup: () => void
  onRedirect: (path: string) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

type DashboardNotFoundProps = {
  path: string
  onBack: () => void
  onShowSignup: () => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const roleOptions = [
  {
    value: "manager",
    title: "Manager",
    description: "Create organization-level visibility and read delivery risk across teams.",
    icon: ShieldCheckIcon,
  },
  {
    value: "team-lead",
    title: "Team Lead",
    description: "Coordinate sprint work, unblock contributors, and keep projects moving.",
    icon: BriefcaseBusinessIcon,
  },
  {
    value: "member",
    title: "Team Member",
    description: "Track your assigned work, connect code activity, and receive useful feedback.",
    icon: UsersIcon,
  },
] satisfies Array<{
  value: Role
  title: string
  description: string
  icon: typeof ShieldCheckIcon
}>

const signupSteps = [
  { step: 1, title: "Create Account" },
  { step: 2, title: "Select Role" },
  { step: 3, title: "Basic Details" },
] satisfies Array<{ step: SignupStep; title: string }>

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
    role: z.enum(["manager", "team-lead", "member"], {
      error: "Select a role.",
    }),
    organizationName: z.string().min(2, "Enter your organization name."),
    dateOfBirth: z.string().min(1, "Enter your date of birth."),
    location: z.string().min(2, "Enter your location."),
    phoneNumber: z.string().min(7, "Enter a valid phone number."),
    githubUsername: z
      .string()
      .min(1, "Enter your GitHub username.")
      .regex(/^[a-zA-Z0-9-]+$/, "Use a valid GitHub username."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

type SignupFormValues = z.infer<typeof signupSchema>

const defaultSignupValues: SignupFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "member",
  organizationName: "",
  dateOfBirth: "",
  location: "",
  phoneNumber: "",
  githubUsername: "",
}

const stepFields: Record<SignupStep, Array<keyof SignupFormValues>> = {
  1: ["fullName", "email", "password", "confirmPassword"],
  2: ["role"],
  3: [
    "organizationName",
    "dateOfBirth",
    "location",
    "phoneNumber",
    "githubUsername",
  ],
}

const roleRedirects: Record<Role, string> = {
  manager: "/admin/dashboard",
  "team-lead": "/tl/dashboard",
  member: "/tm/dashboard",
}

function getStoredRole(): Role {
  const storedRole = window.localStorage.getItem("atrifex-registered-role")

  if (storedRole === "manager" || storedRole === "team-lead" || storedRole === "member") {
    return storedRole
  }

  return "manager"
}

export function AuthPage({
  mode,
  onBack,
  onShowLogin,
  onShowSignup,
  onRedirect,
  theme,
  onThemeChange,
}: AuthPageProps) {
  const isLoading = mode === "login-loading" || mode === "signup-loading"
  const isSignup = mode === "signup" || mode === "signup-loading"
  const toggleTheme = () => onThemeChange(theme === "dark" ? "light" : "dark")

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AuthBackground />
      <AuthHeader onBack={onBack} onThemeToggle={toggleTheme} theme={theme} />

      <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          animate={isLoading ? { opacity: 0, y: 12, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
          aria-hidden={isLoading}
          className={cn("w-full", isSignup ? "max-w-5xl" : "max-w-sm", isLoading && "pointer-events-none")}
          initial={false}
          transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
        >
          {isSignup ? (
            <SignupFlow onShowLogin={onShowLogin} />
          ) : (
            <LoginCard onLoginSuccess={onRedirect} onShowSignup={onShowSignup} />
          )}
        </motion.div>

        <AnimatePresence initial={false}>
          {isLoading && (
            <AuthLoader
              key="auth-loader"
              description={isSignup ? "Preparing your account workspace." : "Securing your workspace access."}
              title={isSignup ? "Preparing sign up" : "Preparing login"}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export function DashboardNotFound({
  path,
  onBack,
  onShowSignup,
  theme,
  onThemeChange,
}: DashboardNotFoundProps) {
  const toggleTheme = () => onThemeChange(theme === "dark" ? "light" : "dark")

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AuthBackground />
      <AuthHeader onBack={onBack} onThemeToggle={toggleTheme} theme={theme} />

      <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 py-10 sm:px-8">
        <Card className="w-full max-w-xl border-border/80 bg-card/85 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35),0_0_80px_rgba(0,229,255,0.1)] backdrop-blur">
          <CardHeader>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <SparklesIcon />
            </div>
            <CardTitle className="text-3xl">404 dashboard not found</CardTitle>
            <CardDescription>
              The account was routed to <span className="font-mono text-foreground">{path}</span>, but that dashboard has not been connected yet.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2 sm:flex-row">
            <Button className="w-full active:scale-[0.96] transition-transform duration-200" onClick={onShowSignup}>
              Create another account
            </Button>
            <Button className="w-full active:scale-[0.96] transition-transform duration-200" onClick={onBack} variant="outline">
              Back to landing
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

function AuthHeader({
  onBack,
  onThemeToggle,
  theme,
}: {
  onBack: () => void
  onThemeToggle: () => void
  theme: Theme
}) {
  return (
    <header className="relative flex justify-center px-3 sm:px-5">
      <div className="flex h-16 w-full max-w-3xl items-center justify-between rounded-b-[1.75rem] border border-t-0 border-border/80 bg-card/90 px-3 text-card-foreground shadow-[0_24px_80px_rgba(0,0,0,0.18),0_0_60px_color-mix(in_oklab,var(--primary)_18%,transparent)] backdrop-blur-xl sm:px-4">
        <button
          className="flex min-h-10 items-center gap-3 rounded-2xl pr-2 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onBack}
          type="button"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-b from-primary to-accent text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_0_28px_rgba(0,229,255,0.28)]">
            <SparklesIcon />
          </span>
          <span className="text-base font-semibold text-foreground">AtriFex</span>
        </button>
        <div className="flex items-center gap-2">
          <Button className="text-muted-foreground hover:text-foreground" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="relative border-border/80 bg-background/30 transition-transform duration-200 hover:bg-muted/70 active:scale-[0.96]"
            onClick={onThemeToggle}
            size="icon-lg"
            variant="outline"
          >
            <SparklesIcon
              className={cn(
                "absolute transition-[opacity,scale,filter] duration-300",
                theme === "light" ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
              )}
            />
            <SparklesIcon
              className={cn(
                "transition-[opacity,scale,filter] duration-300",
                theme === "dark" ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
              )}
            />
          </Button>
        </div>
      </div>
    </header>
  )
}

function AuthBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_70%,transparent)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_34rem),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_28rem)]" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

function AuthLoader({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center px-5 backdrop-blur-md"
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
    >
      <Card className="w-full max-w-xs border-border/80 bg-card/80 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <CardHeader>
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <LoaderCircleIcon className="animate-spin" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

function GitHubButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <Button
      className="w-full active:scale-[0.96] transition-transform duration-200"
      disabled={disabled}
      onClick={onClick}
      type={type}
      variant="outline"
    >
      <GitHubMark data-icon="inline-start" />
      {children}
    </Button>
  )
}

function LoginCard({
  onLoginSuccess,
  onShowSignup,
}: {
  onLoginSuccess: (path: string) => void
  onShowSignup: () => void
}) {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await finishLogin()
  }

  const finishLogin = async () => {
    setIsLoggingIn(true)
    await wait(700)
    onLoginSuccess(roleRedirects[getStoredRole()])
    setIsLoggingIn(false)
  }

  return (
    <Card className="w-full max-w-sm border-border/80 bg-card/85 shadow-[0_30px_120px_rgba(0,0,0,0.35),0_0_80px_rgba(0,229,255,0.1)] backdrop-blur">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
        <CardAction>
          <Button variant="link" onClick={onShowSignup}>
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">
                <MailIcon />
                Email
              </FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </Field>
            <Field>
              <div className="flex items-center gap-3">
                <FieldLabel htmlFor="password">
                  <LockKeyholeIcon />
                  Password
                </FieldLabel>
                <a
                  href="#"
                  className="ml-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full active:scale-[0.96] transition-transform duration-200" disabled={isLoggingIn} type="submit">
            {isLoggingIn && <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />}
            Login
          </Button>
          <GitHubButton disabled={isLoggingIn} onClick={finishLogin}>Login with GitHub</GitHubButton>
        </CardFooter>
      </form>
    </Card>
  )
}

function SignupFlow({ onShowLogin }: { onShowLogin: () => void }) {
  const [step, setStep] = useState<SignupStep>(1)
  const [pendingAction, setPendingAction] = useState<"next" | "github" | "submit" | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: defaultSignupValues,
  })
  const selectedRole = useWatch({ control: form.control, name: "role" })
  const currentStep = signupSteps.find((item) => item.step === step) ?? signupSteps[0]

  const runStepValidation = async () => {
    return form.trigger(stepFields[step], { shouldFocus: true })
  }

  const goToNextStep = async () => {
    setPendingAction("next")
    const isValid = await runStepValidation()
    await wait(320)
    if (isValid) {
      setStep((current) => (current === 1 ? 2 : 3))
    }
    setPendingAction(null)
  }

  const continueWithGitHub = async () => {
    setPendingAction("github")
    await wait(520)
    setStep(2)
    setPendingAction(null)
  }

  const submitSignup = form.handleSubmit(async (values) => {
    setPendingAction("submit")
    await wait(700)
    window.localStorage.setItem("atrifex-registered-role", values.role)
    setIsComplete(true)
    await wait(1200)
    onShowLogin()
  })

  if (isComplete) {
    return (
      <Card className="mx-auto w-full max-w-xl border-border/80 bg-card/85 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35),0_0_80px_rgba(0,229,255,0.1)] backdrop-blur">
        <CardHeader>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <CheckCircle2Icon />
          </div>
          <CardTitle className="text-2xl">Account created successfully.</CardTitle>
          <CardDescription>Redirecting to sign in...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full border-border/80 bg-card/85 shadow-[0_30px_120px_rgba(0,0,0,0.35),0_0_80px_rgba(0,229,255,0.1)] backdrop-blur">
      <CardHeader className="gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-balance text-3xl">Create your Forge account</CardTitle>
            <CardDescription>
              Three steps to shape the right workspace for your engineering role.
            </CardDescription>
          </div>
          <CardAction className="static justify-self-auto">
            <Button variant="link" onClick={onShowLogin}>
              Sign in
            </Button>
          </CardAction>
        </div>
        <StepProgress currentStep={step} />
      </CardHeader>

      <form onSubmit={submitSignup}>
        <CardContent>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 12 }}
              key={step}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    Step {step} of 3
                  </p>
                  <h2 className="text-balance text-xl font-semibold">{currentStep.title}</h2>
                </div>
                <span className="font-mono text-sm text-muted-foreground tabular-nums">
                  {Math.round((step / 3) * 100)}%
                </span>
              </div>
              {step === 1 && (
                <CreateAccountStep
                  form={form}
                  isGitHubLoading={pendingAction === "github"}
                  onContinueWithGitHub={continueWithGitHub}
                  onShowLogin={onShowLogin}
                />
              )}
              {step === 2 && <SelectRoleStep form={form} selectedRole={selectedRole} />}
              {step === 3 && <BasicDetailsStep form={form} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            className="w-full active:scale-[0.96] transition-transform duration-200 sm:w-auto"
            disabled={step === 1 || pendingAction !== null}
            onClick={() => setStep((current) => (current === 3 ? 2 : 1))}
            type="button"
            variant="outline"
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Back
          </Button>
          {step < 3 ? (
            <Button
              className="w-full active:scale-[0.96] transition-transform duration-200 sm:w-auto"
              disabled={pendingAction !== null}
              onClick={goToNextStep}
              type="button"
            >
              {pendingAction === "next" && <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />}
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button
              className="w-full active:scale-[0.96] transition-transform duration-200 sm:w-auto"
              disabled={pendingAction !== null}
              type="submit"
            >
              {pendingAction === "submit" && <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />}
              Create account
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

function StepProgress({ currentStep }: { currentStep: SignupStep }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {signupSteps.map((item) => {
        const isActive = item.step === currentStep
        const isComplete = item.step < currentStep

        return (
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border bg-background/60 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-[border-color,box-shadow,background-color] duration-300",
              isActive && "border-primary/60 bg-primary/10 shadow-[0_0_40px_rgba(0,229,255,0.12)]",
              isComplete && "border-accent/50 bg-accent/10"
            )}
            key={item.step}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-lg border font-mono text-xs tabular-nums",
                  isActive && "border-primary/40 bg-primary/15 text-primary",
                  isComplete && "border-accent/40 bg-accent/15 text-accent",
                  !isActive && !isComplete && "border-border text-muted-foreground"
                )}
              >
                {isComplete ? <CheckCircle2Icon /> : item.step}
              </span>
              <span className="text-sm font-medium">{item.title}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CreateAccountStep({
  form,
  isGitHubLoading,
  onContinueWithGitHub,
  onShowLogin,
}: {
  form: ReturnType<typeof useForm<SignupFormValues>>
  isGitHubLoading: boolean
  onContinueWithGitHub: () => void
  onShowLogin: () => void
}) {
  const errors = form.formState.errors

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <FieldGroup>
        <FormInput
          error={errors.fullName?.message}
          icon={UserIcon}
          label="Full Name"
          registration={form.register("fullName")}
        />
        <FormInput
          error={errors.email?.message}
          icon={MailIcon}
          label="Email"
          placeholder="m@example.com"
          registration={form.register("email")}
          type="email"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            error={errors.password?.message}
            icon={LockKeyholeIcon}
            label="Password"
            registration={form.register("password")}
            type="password"
          />
          <FormInput
            error={errors.confirmPassword?.message}
            icon={LockKeyholeIcon}
            label="Confirm Password"
            registration={form.register("confirmPassword")}
            type="password"
          />
        </div>
      </FieldGroup>
      <Card className="border-border/70 bg-background/65">
        <CardHeader>
          <CardTitle>Fast path</CardTitle>
          <CardDescription>Use GitHub to prefill code identity later when the backend is connected.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <GitHubButton disabled={isGitHubLoading} onClick={onContinueWithGitHub}>
            {isGitHubLoading ? "Connecting GitHub" : "Continue with GitHub"}
          </GitHubButton>
          <Separator />
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <button className="underline underline-offset-4 hover:text-primary" onClick={onShowLogin} type="button">
              Sign in
            </button>
          </FieldDescription>
        </CardContent>
      </Card>
    </div>
  )
}

function SelectRoleStep({
  form,
  selectedRole,
}: {
  form: ReturnType<typeof useForm<SignupFormValues>>
  selectedRole: Role
}) {
  const roleError = form.formState.errors.role?.message

  return (
    <Field data-invalid={!!roleError}>
      <div className="grid gap-4 lg:grid-cols-3">
        {roleOptions.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.value

          return (
            <button
              aria-checked={isSelected}
              className="group min-h-48 rounded-xl text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              key={role.value}
              onClick={() => form.setValue("role", role.value, { shouldDirty: true, shouldValidate: true })}
              role="radio"
              type="button"
            >
              <Card
                className={cn(
                  "h-full border-border/80 bg-background/65 shadow-[0_12px_50px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow,transform,background-color] duration-300 group-hover:-translate-y-1",
                  isSelected && "border-primary/60 bg-primary/10 shadow-[0_0_70px_rgba(0,229,255,0.14)]"
                )}
              >
                <CardHeader>
                  <div
                    className={cn(
                      "grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border",
                      isSelected && "bg-primary/15 text-primary ring-primary/30"
                    )}
                  >
                    <Icon />
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          )
        })}
      </div>
      <FieldError>{roleError}</FieldError>
    </Field>
  )
}

function BasicDetailsStep({ form }: { form: ReturnType<typeof useForm<SignupFormValues>> }) {
  const errors = form.formState.errors

  return (
    <FieldGroup>
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          error={errors.organizationName?.message}
          icon={Building2Icon}
          label="Organization Name"
          registration={form.register("organizationName")}
        />
        <FormInput
          error={errors.dateOfBirth?.message}
          icon={CalendarIcon}
          label="Date of Birth"
          registration={form.register("dateOfBirth")}
          type="date"
        />
        <FormInput
          error={errors.location?.message}
          icon={MapPinIcon}
          label="Location"
          registration={form.register("location")}
        />
        <FormInput
          error={errors.phoneNumber?.message}
          icon={PhoneIcon}
          label="Phone Number"
          registration={form.register("phoneNumber")}
          type="tel"
        />
        <FormInput
          error={errors.githubUsername?.message}
          icon={GitBranchIcon}
          label="GitHub Username"
          placeholder="octocat"
          registration={form.register("githubUsername")}
        />
      </div>
    </FieldGroup>
  )
}

function FormInput({
  error,
  icon: Icon,
  label,
  placeholder,
  registration,
  type = "text",
}: {
  error?: string
  icon: typeof UserIcon
  label: string
  placeholder?: string
  registration: ReturnType<ReturnType<typeof useForm<SignupFormValues>>["register"]>
  type?: string
}) {
  const inputId = registration.name

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={inputId}>
        <Icon />
        {label}
      </FieldLabel>
      <Input
        aria-invalid={!!error}
        id={inputId}
        placeholder={placeholder}
        type={type}
        {...registration}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

function GitHubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.5v-1.91c-2.78.62-3.36-1.22-3.36-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.31 9.31 0 0 1 12 6.97c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .28.18.6.69.5A10.24 10.24 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  )
}
