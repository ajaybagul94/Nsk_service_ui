"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell, Search, DollarSign, TrendingUp, TrendingDown,
  Briefcase, Ban, CheckCircle, XCircle, Clock, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin-layout";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchAdminDashboard } from "@/lib/api/dashboard";
import type { AdminDashboard } from "@/lib/api/types";
import { getServiceColors, getServiceIcon } from "@/lib/service-icons";

function AdminDashboardContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminDashboard());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"><CheckCircle className="h-3 w-3" /> {status}</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400"><Clock className="h-3 w-3" /> {status}</span>;
      case "suspended":
      case "refunded":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"><XCircle className="h-3 w-3" /> {status}</span>;
      default:
        return <span className="text-sm text-muted-foreground">{status}</span>;
    }
  };

  const filteredUsers = data?.recentUsers.filter(
    (u) =>
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  return (
    <>
      <div className="mb-6 flex items-center justify-end gap-4 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 bg-secondary pl-10"
          />
        </div>
        <ThemeToggle />
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
          <Bell className="h-5 w-5" />
        </button>
        <Button variant="outline" size="sm" onClick={() => void loadDashboard()} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="mb-6 hidden items-center justify-end gap-4 lg:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-64 bg-secondary pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadDashboard()} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-24 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button className="mt-4" onClick={() => void loadDashboard()}>Retry</Button>
        </div>
      )}
      {!loading && !error && data && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.overviewStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Service Performance</h2>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Jobs</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Providers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.serviceStats.map((service) => {
                      const Icon = getServiceIcon(service.iconKey);
                      const colors = getServiceColors(service.code);
                      return (
                        <tr key={service.code} className="border-b border-border last:border-0">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-2 ${colors.bgColor}`}>
                                <Icon className={`h-4 w-4 ${colors.color}`} />
                              </div>
                              <span className="font-medium text-foreground">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-foreground">{service.jobs.toLocaleString()}</td>
                          <td className="px-4 py-4 font-medium text-primary">{service.revenue}</td>
                          <td className="px-4 py-4 text-foreground">{service.providers}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/approvals"
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <Briefcase className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Verify Providers</p>
                    <p className="text-sm text-muted-foreground">
                      {data.quickActions.pendingVerifications} pending verifications
                    </p>
                  </div>
                </Link>
                <Link
                  href="/admin/invitations"
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Invite Providers</p>
                    <p className="text-sm text-muted-foreground">Send invitations by provider type</p>
                  </div>
                </Link>
                <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <div className="rounded-lg bg-red-500/10 p-2">
                    <Ban className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Review Disputes</p>
                    <p className="text-sm text-muted-foreground">
                      {data.quickActions.openDisputes} open disputes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Users</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.type === "Provider" ? "bg-blue-500/10 text-blue-400" : "bg-gray-500/10 text-gray-400"
                        }`}>
                          {user.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-foreground">{user.service || "-"}</td>
                      <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-4 text-muted-foreground">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Transactions</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 font-medium text-foreground">{tx.customer}</td>
                      <td className="px-4 py-4 text-foreground">{tx.provider}</td>
                      <td className="px-4 py-4 text-foreground">{tx.service}</td>
                      <td className="px-4 py-4 font-medium text-primary">{tx.amount}</td>
                      <td className="px-4 py-4">{getStatusBadge(tx.status)}</td>
                      <td className="px-4 py-4 text-muted-foreground">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard Overview" subtitle="Live data from API">
      <AdminDashboardContent />
    </AdminLayout>
  );
}
