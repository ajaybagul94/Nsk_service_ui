"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wrench,
  Zap,
  Bug,
  Car,
  Droplets,
  Settings,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register } from "@/lib/api";
import { getDashboardPath, saveAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

const userRoles = [
  {
    id: "customer",
    label: "Customer",
    description: "Book services for your home",
    icon: Shield,
  },
  {
    id: "plumber",
    label: "Plumber",
    description: "Provide plumbing services",
    icon: Wrench,
  },
  {
    id: "electrician",
    label: "Electrician",
    description: "Provide electrical services",
    icon: Zap,
  },
  {
    id: "garage",
    label: "Garage",
    description: "Vehicle repair services",
    icon: Settings,
  },
  {
    id: "pestcontrol",
    label: "Pest Control",
    description: "Pest elimination services",
    icon: Bug,
  },
  {
    id: "washer",
    label: "Car/Bike Washer",
    description: "Vehicle washing services",
    icon: Car,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage the platform",
    icon: Droplets,
  },
];

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    initialRole === "provider" ? "" : initialRole,
  );
  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep(2);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = isLogin
        ? await login(formData.email, formData.password, selectedRole)
        : await register(
            formData.email,
            formData.password,
            formData.name,
            formData.phone,
            selectedRole,
          );

      saveAuth(response.accessToken, response.user);
      const redirect = searchParams.get("redirect");
      router.push(redirect ?? getDashboardPath(response.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedRole("");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-card p-12 lg:flex">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              ServiConnect
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground">
            Your trusted partner for
            <span className="text-primary"> home services</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified professionals or offer your services to
            thousands of customers.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[Wrench, Zap, Bug, Settings, Car, Droplets].map((Icon, i) => (
              <div
                key={i}
                className="flex h-16 items-center justify-center rounded-lg border border-border bg-secondary/50"
              >
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; 2026 ServiConnect. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        <div className="absolute right-6 top-6 z-10 hidden lg:block">
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              ServiConnect
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {step === 1 ? (
              // Step 1: Role Selection
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isLogin ? "Welcome back" : "Create an account"}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Select your role to continue
                  </p>
                </div>
                <div className="grid gap-3">
                  {userRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-card/80"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {role.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-primary hover:underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </>
            ) : (
              // Step 2: Login/Register Form
              <>
                <div>
                  <button
                    onClick={handleBack}
                    className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to role selection
                  </button>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const role = userRoles.find((r) => r.id === selectedRole);
                      if (role) {
                        const Icon = role.icon;
                        return (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {isLogin ? "Sign in" : "Create account"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        as {userRoles.find((r) => r.id === selectedRole)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="h-12 bg-secondary"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 bg-secondary"
                    />
                  </div>
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-12 bg-secondary"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {isLogin && (
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="h-12 bg-secondary pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Sign in"
                        : "Create account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-primary hover:underline"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
