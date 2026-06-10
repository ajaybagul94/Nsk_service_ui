"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { ProviderRoleNav } from "@/components/provider-role-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvitation, fetchInvitations, type InvitationRow } from "@/lib/api/admin";
import { PROVIDER_ROLE_FILTERS, type ProviderRoleFilterId } from "@/lib/provider-roles";

const INVITE_ROLES = PROVIDER_ROLE_FILTERS.filter((r) => r.id !== "all");

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    sent: "bg-blue-500/10 text-blue-400",
    accepted: "bg-emerald-500/10 text-emerald-400",
    expired: "bg-gray-500/10 text-gray-400",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] ?? "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function AdminInvitationsPage() {
  const [roleFilter, setRoleFilter] = useState<ProviderRoleFilterId>("all");
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("plumber");
  const [submitting, setSubmitting] = useState(false);

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setInvitations(await fetchInvitations(roleFilter));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    void loadInvitations();
  }, [loadInvitations]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createInvitation(email.trim(), inviteRole);
      setEmail("");
      await loadInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Provider Invitations"
      subtitle="Invite providers to join ServiConnect — customers cannot be invited here"
    >
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Plus className="h-5 w-5" />
          Send Invitation
        </h2>
        <form onSubmit={(e) => void handleInvite(e)} className="grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="provider@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Provider type</Label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVITE_ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Invite
          </Button>
        </form>
      </div>

      <ProviderRoleNav activeRole={roleFilter} onRoleChange={setRoleFilter} />

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Provider Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invited By</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Accepted</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No invitations found for this filter.
                  </td>
                </tr>
              ) : (
                invitations.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4 font-medium text-foreground">{inv.email}</td>
                    <td className="px-4 py-4 text-foreground">{inv.providerRoleLabel}</td>
                    <td className="px-4 py-4">{statusBadge(inv.status)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inv.invitedBy}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inv.createdAt}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inv.acceptedAt ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
