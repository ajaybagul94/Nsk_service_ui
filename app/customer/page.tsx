"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench, Bell, Search, MapPin, Star, Clock, User, LogOut, CreditCard,
  Calendar, CheckCircle, Loader2, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createCustomerBooking, fetchCustomerDashboard } from "@/lib/api/dashboard";
import type { CustomerDashboard, NearbyProvider, ServiceItem } from "@/lib/api/types";
import { getServiceColors, getServiceIcon } from "@/lib/service-icons";

function CustomerDashboardContent() {
  const handleLogout = useLogout();
  const authUser = getStoredUser();
  const [data, setData] = useState<CustomerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<NearbyProvider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingDescription, setBookingDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [submitting, setSubmitting] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchCustomerDashboard());
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
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"><CheckCircle className="h-3 w-3" /> Completed</span>;
      case "in-progress":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400"><Loader2 className="h-3 w-3 animate-spin" /> In Progress</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400"><Clock className="h-3 w-3" /> Pending</span>;
      default:
        return null;
    }
  };

  const handleConfirmBooking = async () => {
    const service = selectedService ?? data?.services[0];
    if (!service) return;
    setSubmitting(true);
    try {
      await createCustomerBooking({
        serviceCode: service.code,
        providerId: selectedProvider?.id,
        title: `${service.title} service`,
        description: bookingDescription,
        address: bookingAddress,
        scheduledDate: bookingDate || undefined,
        scheduledTime: bookingTime || undefined,
        amount: 100,
        paymentMethod,
      });
      setShowBookingModal(false);
      setSelectedProvider(null);
      setSelectedService(null);
      await loadDashboard();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
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
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customer/api" className="gap-2">
                <Code2 className="h-4 w-4" />
                APIs
              </Link>
            </Button>
            <ThemeToggle />
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium text-foreground">{authUser?.fullName ?? "Customer"}</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back, {authUser?.fullName?.split(" ")[0] ?? "there"}
            </h1>
            <p className="mt-1 text-muted-foreground">What service do you need today?</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadDashboard()} disabled={loading}>
            Refresh
          </Button>
        </div>

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
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Services</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {data.services.map((service) => {
                  const Icon = getServiceIcon(service.iconKey);
                  const colors = getServiceColors(service.code);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(service);
                        setShowBookingModal(true);
                      }}
                      className={`group flex flex-col items-center rounded-xl border p-6 transition-all hover:border-primary hover:bg-card/80 ${
                        selectedService?.id === service.id ? "border-primary bg-card" : "border-border bg-card"
                      }`}
                    >
                      <div className={`mb-3 rounded-lg p-3 ${colors.bgColor}`}>
                        <Icon className={`h-6 w-6 ${colors.color}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{service.title}</span>
                      <span className="mt-1 text-xs text-muted-foreground">{service.providers} providers</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
              <section className="lg:col-span-2">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Bookings</h2>
                <div className="space-y-4">
                  {data.recentBookings.length === 0 && (
                    <p className="text-sm text-muted-foreground">No bookings yet.</p>
                  )}
                  {data.recentBookings.map((booking) => {
                    const Icon = Wrench;
                    return (
                      <div key={booking.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{booking.service}</h3>
                            <p className="text-sm text-muted-foreground">{booking.provider} • {booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(booking.status)}
                          <div className="text-right">
                            <p className="font-medium text-foreground">${booking.amount}</p>
                            {booking.rating != null && (
                              <div className="flex items-center gap-1 text-sm text-yellow-400">
                                <Star className="h-3 w-3 fill-current" />
                                {booking.rating}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Nearby Providers</h2>
                <div className="space-y-3">
                  {data.nearbyProviders.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowBookingModal(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                          {provider.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">{provider.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-foreground">{provider.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {provider.distance}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground">Book Service</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedProvider
                ? `Book ${selectedProvider.name}`
                : `Book a ${selectedService?.title ?? "service"}`}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Select Date</label>
                <Input type="date" className="h-12 bg-secondary" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Select Time</label>
                <Input type="time" className="h-12 bg-secondary" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Address</label>
                <Input placeholder="Enter your address" className="h-12 bg-secondary" value={bookingAddress} onChange={(e) => setBookingAddress(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue..."
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={bookingDescription}
                  onChange={(e) => setBookingDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium ${
                      paymentMethod === "ONLINE" ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground"
                    }`}
                    onClick={() => setPaymentMethod("ONLINE")}
                  >
                    <CreditCard className="h-4 w-4" />
                    Online Payment
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium ${
                      paymentMethod === "COD" ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground"
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowBookingModal(false); setSelectedProvider(null); setSelectedService(null); }}>
                Cancel
              </Button>
              <Button className="flex-1" disabled={submitting} onClick={() => void handleConfirmBooking()}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <AuthGuard allowedRoles={["CUSTOMER"]}>
      <CustomerDashboardContent />
    </AuthGuard>
  );
}
