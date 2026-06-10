"use client";

import { AdminLayout } from "@/components/admin-layout";
import { ApiReferencePage } from "@/components/api-reference-page";
import { fetchAdminApiEndpoints } from "@/lib/api/dashboard";

export default function AdminApiPage() {
  return (
    <AdminLayout title="API Reference" subtitle="Admin endpoints">
      <ApiReferencePage
        title="Admin API Reference"
        backHref="/admin"
        loadEndpoints={fetchAdminApiEndpoints}
        embedded
      />
    </AdminLayout>
  );
}
