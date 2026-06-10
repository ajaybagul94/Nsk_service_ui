"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiEndpoint } from "@/lib/api/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/nashik-service/api";

type ApiReferencePageProps = {
  title: string;
  backHref: string;
  loadEndpoints: () => Promise<ApiEndpoint[]>;
  embedded?: boolean;
};

export function ApiReferencePage({ title, backHref, loadEndpoints, embedded = false }: ApiReferencePageProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await loadEndpoints();
        if (!cancelled) setEndpoints(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load APIs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadEndpoints]);

  return (
    <div className={embedded ? "" : "min-h-screen bg-background p-6 sm:p-8"}>
      <div className={embedded ? "" : "mx-auto max-w-3xl"}>
        {!embedded && (
          <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        )}
        {!embedded && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
        <p className={`text-sm text-muted-foreground ${embedded ? "" : "mt-2"}`}>
          Base URL: <code className="rounded bg-secondary px-2 py-0.5">{API_BASE}</code>
        </p>

        {loading && (
          <div className="mt-12 flex justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {error && <p className="mt-8 text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="mt-8 space-y-4">
            {endpoints.map((ep) => (
              <div
                key={`${ep.method}-${ep.path}`}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {ep.method}
                  </span>
                  <code className="text-sm text-foreground">{ep.path}</code>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ep.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">Role: {ep.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
