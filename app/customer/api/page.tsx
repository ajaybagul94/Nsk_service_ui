"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ApiReferencePage } from "@/components/api-reference-page";
import { fetchCustomerApiEndpoints } from "@/lib/api/dashboard";

export default function CustomerApiPage() {
  return (
    <AuthGuard allowedRoles={["CUSTOMER"]}>
      <ApiReferencePage
        title="Customer API Reference"
        backHref="/customer"
        loadEndpoints={fetchCustomerApiEndpoints}
      />
    </AuthGuard>
  );
}
