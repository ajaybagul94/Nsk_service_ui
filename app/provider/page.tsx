"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench, Bell, User, LogOut, CreditCard, Calendar, CheckCircle,
  Clock, MapPin, Star, DollarSign, Phone, MessageSquare, Navigation, Check, X,
  Loader2, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthGuard, useLogout } from "@/components/auth-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStoredUser } from "@/lib/auth";
import {
  acceptProviderBooking,
  completeProviderBooking,
  declineProviderBooking,
  fetchProviderDashboard,
  markProviderNotificationsRead,
} from "@/lib/api/dashboard";
import type { ProviderDashboard } from "@/lib/api/types";
import { ProviderApprovalBanner } from "@/components/provider-approval-banner";

const PROVIDER_ROLES = ["PLUMBER", "ELECTRICIAN", "GARAGE", "PEST_CONTROL", "WASHER"];

function ProviderDashboardContent() {
  const handleLogout = useLogout();
  const authUser = getStoredUser();
  const [data, setData] = useState<ProviderDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJobComplete, setShowJobComplete] = useState(false);
  const [finalAmount, setFinalAmount] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await fetchProviderDashboard();
      setData(dashboard);
      if (dashboard.activeJob) {
        setFinalAmount(dashboard.activeJob.estimatedPay.replace(/[^0-9.]/g, "") || "0");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const unreadCount = data?.notifications.filter((n) => n.unread).length ?? 0;

  const handleAccept = async (jobId: number) => {
    setActionLoading(jobId);
    try {
      await acceptProviderBooking(jobId);
      await loadDashboard();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to accept");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (jobId: number) => {
    setActionLoading(jobId);
    try {
      await declineProviderBooking(jobId);
      await loadDashboard();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to decline");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async () => {
    if (!data?.activeJob) return;
    try {
      await completeProviderBooking(data.activeJob.id, {
        finalAmount: parseFloat(finalAmount) || 0,
        paymentMethod: "ONLINE",
      });
      setShowJobComplete(false);
      await loadDashboard();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to complete job");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ServiConnect</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Provider</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/provider/api" className="gap-2">
                <Code2 className="h-4 w-4" />
                APIs
              </Link>
            </Button>
            <ThemeToggle />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && data && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border p-4">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {data.notifications.map((notif) => (
                      <div key={notif.id} className={`border-b border-border p-4 last:border-0 ${notif.unread ? "bg-primary/5" : ""}`}>
                        <p className="text-sm text-foreground">{notif.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border p-3">
                    <button
                      type="button"
                      className="w-full text-center text-sm text-primary hover:underline"
                      onClick={() => void markProviderNotificationsRead().then(() => loadDashboard())}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium text-foreground">{authUser?.fullName ?? "Provider"}</p>
                  <p className="text-sm text-muted-foreground">{authUser?.email ?? ""}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => void handleLogout()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProviderApprovalBanner />
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
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
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {data.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-primary">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                {data.activeJob && (
                  <section>
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Active Job</h2>
                    <div className="rounded-xl border-2 border-primary bg-card p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            In Progress
                          </span>
                          <h3 className="mt-2 text-xl font-semibold text-foreground">{data.activeJob.service}</h3>
                          <p className="text-muted-foreground">{data.activeJob.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{data.activeJob.estimatedPay}</p>
                        </div>
                      </div>
                      <div className="mb-4 space-y-2 rounded-lg bg-secondary p-4 text-sm">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{data.activeJob.address}</div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{data.activeJob.phone}</div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" />Started at {data.activeJob.startTime}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{data.activeJob.description}</p>
                      <div className="mt-4 flex gap-3">
                        <Button variant="outline" className="flex-1 gap-2"><Navigation className="h-4 w-4" />Navigate</Button>
                        <Button variant="outline" className="flex-1 gap-2"><MessageSquare className="h-4 w-4" />Message</Button>
                        <Button className="flex-1 gap-2" onClick={() => setShowJobComplete(true)}>
                          <CheckCircle className="h-4 w-4" />Complete
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Pending Requests</h2>
                    <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                      {data.pendingRequests.length} new
                    </span>
                  </div>
                  <div className="space-y-4">
                    {data.pendingRequests.map((request) => (
                      <div key={request.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{request.service}</h3>
                            <p className="text-sm text-muted-foreground">{request.customer}</p>
                          </div>
                          <p className="text-lg font-bold text-primary">{request.estimatedPay}</p>
                        </div>
                        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{request.distance}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{request.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{request.time}</span>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 border-red-500/50 text-red-400"
                            disabled={actionLoading === request.id}
                            onClick={() => void handleDecline(request.id)}
                          >
                            <X className="h-4 w-4" />Decline
                          </Button>
                          <Button
                            className="flex-1 gap-2"
                            disabled={actionLoading === request.id}
                            onClick={() => void handleAccept(request.id)}
                          >
                            {actionLoading === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Completed</h2>
                  <div className="space-y-3">
                    {data.completedJobs.map((job) => (
                      <div key={job.id} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{job.service}</p>
                            <p className="text-sm text-muted-foreground">{job.customer}</p>
                          </div>
                          <p className="font-semibold text-primary">{job.amount}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{job.date}</span>
                          {job.rating != null && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {job.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </main>

      {showJobComplete && data?.activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground">Complete Job</h2>
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Final Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  className="h-12 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-foreground"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowJobComplete(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => void handleComplete()}>Confirm & Complete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProviderDashboard() {
  return (
    <AuthGuard allowedRoles={PROVIDER_ROLES}>
      <ProviderDashboardContent />
    </AuthGuard>
  );
}
