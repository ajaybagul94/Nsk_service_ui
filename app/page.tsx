import Link from "next/link";
import { Wrench, Zap, Bug, Car, Droplets, Settings, Shield, Clock, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const services = [
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Expert plumbers for repairs, installations, and maintenance",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Licensed electricians for all your electrical needs",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Settings,
    title: "Garage",
    description: "Professional mechanics for vehicle repairs and servicing",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Bug,
    title: "Pest Control",
    description: "Effective pest elimination and prevention services",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Car,
    title: "Car Washing",
    description: "Premium car cleaning and detailing services",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Droplets,
    title: "Bike Washing",
    description: "Professional bike cleaning and maintenance",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Providers",
    description: "All service providers are background-checked and verified for your safety",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get connected with available providers within minutes",
  },
  {
    icon: Star,
    title: "Quality Service",
    description: "Rated and reviewed by real customers for guaranteed quality",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Service Providers" },
  { value: "50K+", label: "Jobs Completed" },
  { value: "4.8", label: "Average Rating" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ServiConnect</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Services
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How it Works
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle className="text-muted-foreground hover:text-foreground" />
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground">Trusted by 10,000+ customers</span>
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your One-Stop Solution for
              <span className="text-primary"> Home Services</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Connect with verified professionals for plumbing, electrical, pest control, vehicle washing, and more. 
              Fast, reliable, and affordable services at your fingertips.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-12 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                  Book a Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?role=provider">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Become a Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Choose from a wide range of professional home services
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className={`inline-flex rounded-lg p-3 ${service.bgColor}`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Book Now
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-t border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Get started in just a few simple steps
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Choose Service", description: "Select the service you need from our wide range of options" },
              { step: "02", title: "Book Provider", description: "Pick a verified provider based on ratings and availability" },
              { step: "03", title: "Get it Done", description: "Provider arrives, completes the job, and you pay securely" },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose ServiConnect?
              </h2>
              <p className="mt-4 text-muted-foreground">
                We connect you with the best service providers in your area, ensuring quality work every time.
              </p>
              <div className="mt-8 space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="space-y-4">
                  {[
                    "100% Satisfaction Guarantee",
                    "Secure Payment Options",
                    "24/7 Customer Support",
                    "Real-time Job Tracking",
                    "Transparent Pricing",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of satisfied customers who trust ServiConnect for their home service needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="h-12 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Sign Up Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login?role=provider">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">ServiConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 ServiConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
