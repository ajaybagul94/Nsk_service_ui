"use client";

import { PROVIDER_ROLE_FILTERS, type ProviderRoleFilterId } from "@/lib/provider-roles";

export function ProviderRoleNav({
  activeRole,
  onRoleChange,
}: {
  activeRole: ProviderRoleFilterId;
  onRoleChange: (role: ProviderRoleFilterId) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {PROVIDER_ROLE_FILTERS.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onRoleChange(role.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeRole === role.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {role.label}
        </button>
      ))}
    </nav>
  );
}
