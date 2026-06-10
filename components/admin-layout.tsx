"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  User,
  LogOut,
  BarChart3,
  Code2,
  Shield,
  Mail,
  UserCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { AuthGuard, useLogout } from "@/components/auth-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStoredUser } from "@/lib/auth";

const mainNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin" },
  { icon: Code2, label: "API Reference", href: "/admin/api" },
];

const administrationItems = [
  { icon: Mail, label: "Invitations", href: "/admin/invitations" },
  { icon: UserCheck, label: "Approvals", href: "/admin/approvals" },
];

function AdminLayoutShell({ children, title, subtitle }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const handleLogout = useLogout();
  const authUser = getStoredUser();
  const isAdminSection = administrationItems.some((item) => pathname === item.href);
  const [adminOpen, setAdminOpen] = useState(isAdminSection);

  const linkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ServiConnect</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass(item.href)}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setAdminOpen((open) => !open)}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-4 w-4" />
              <span className="flex-1 text-left">Administration</span>
              {adminOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {adminOpen && (
              <ul className="mt-1 space-y-1">
                {administrationItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={`${linkClass(item.href)} pl-8`}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{authUser?.fullName ?? "Admin"}</p>
              <p className="text-xs text-muted-foreground">{authUser?.email ?? ""}</p>
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminLayoutShell title={title} subtitle={subtitle}>
        {children}
      </AdminLayoutShell>
    </AuthGuard>
  );
}
