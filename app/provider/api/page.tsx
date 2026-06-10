"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ApiReferencePage } from "@/components/api-reference-page";
import { fetchProviderApiEndpoints } from "@/lib/api/dashboard";

const PROVIDER_ROLES = ["PLUMBER", "ELECTRICIAN", "GARAGE", "PEST_CONTROL", "WASHER"];

export default function ProviderApiPage() {
  return (
    <AuthGuard allowedRoles={PROVIDER_ROLES}>
      <ApiReferencePage
        title="Provider API Reference"
        backHref="/provider"
        loadEndpoints={fetchProviderApiEndpoints}
      />
    </AuthGuard>
  );
}
