"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredToken, getDashboardPath, decodeJwtPayload } from "@/lib/auth";

type AuthGuardProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.role || !allowedRoles.includes(payload.role)) {
      clearAuth();
      router.replace("/login");
      return;
    }

    const resetIdleTimer = () => {
      const maxAge = 20 * 60;
      document.cookie = `nashik_access_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    const interval = window.setInterval(() => {
      if (!getStoredToken()) {
        router.replace("/login");
      }
    }, 30000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      window.clearInterval(interval);
    };
  }, [allowedRoles, router]);

  return <>{children}</>;
}

export function useLogout() {
  const router = useRouter();

  return async () => {
    const { logout } = await import("@/lib/api");
    await logout();
    router.replace("/login");
  };
}

export { getDashboardPath };
