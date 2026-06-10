"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { ProviderRoleNav } from "@/components/provider-role-nav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchApprovals, submitApprovalReview, type ProviderApprovalRow } from "@/lib/api/admin";
import { type ProviderRoleFilterId } from "@/lib/provider-roles";

type ApprovalAction = "approve" | "reject" | "missing_info";

function statusBadge(status: string) {
  const map: Record<string, { className: string; icon: React.ReactNode }> = {
    pending: { className: "bg-yellow-500/10 text-yellow-400", icon: <AlertCircle className="h-3 w-3" /> },
    rejected: { className: "bg-red-500/10 text-red-400", icon: <XCircle className="h-3 w-3" /> },
    missing_info: { className: "bg-orange-500/10 text-orange-400", icon: <AlertCircle className="h-3 w-3" /> },
    active: { className: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle className="h-3 w-3" /> },
  };
  const style = map[status] ?? { className: "bg-secondary text-muted-foreground", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style.className}`}>
      {style.icon}
      {status.replace("_", " ")}
    </span>
  );
}

function ApprovalRowPanel({
  provider,
  onSubmitted,
}: {
  provider: ProviderApprovalRow;
  onSubmitted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState<ApprovalAction>("approve");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsComment = action === "reject" || action === "missing_info";

  const handleSubmit = async () => {
    if (needsComment && !comment.trim()) {
      setError("Comment is required for reject or missing info");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitApprovalReview(provider.id, action, comment.trim() || undefined);
      setComment("");
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <tr
        className="cursor-pointer border-b border-border hover:bg-secondary/30"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="font-medium text-foreground">{provider.name}</p>
              <p className="text-sm text-muted-foreground">{provider.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-foreground">{provider.providerRoleLabel}</td>
        <td className="px-4 py-4 text-foreground">{provider.serviceCategory || "—"}</td>
        <td className="px-4 py-4">{statusBadge(provider.status)}</td>
        <td className="px-4 py-4 text-muted-foreground">{provider.joined}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-secondary/20">
          <td colSpan={5} className="px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Provider Details</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Full Name</dt>
                    <dd className="font-medium text-foreground">{provider.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="font-medium text-foreground">{provider.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-medium text-foreground">{provider.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Specialty</dt>
                    <dd className="font-medium text-foreground">{provider.specialty || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Service Category</dt>
                    <dd className="font-medium text-foreground">{provider.serviceCategory || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd className="font-medium text-foreground">{provider.joined}</dd>
                  </div>
                </dl>

                {provider.latestComment && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Previous admin feedback</p>
                    <p className="mt-1 text-sm text-foreground">{provider.latestComment}</p>
                    {provider.latestReviewedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">{provider.latestReviewedAt}</p>
                    )}
                  </div>
                )}

                {provider.replies.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Conversation</p>
                    {provider.replies.map((reply) => (
                      <div key={reply.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                        <p className="font-medium text-foreground">
                          {reply.authorName}{" "}
                          <span className="text-xs text-muted-foreground">({reply.authorType})</span>
                        </p>
                        <p className="mt-1 text-foreground">{reply.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{reply.createdAt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground">Review Action</h3>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={action} onValueChange={(v) => setAction(v as ApprovalAction)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="missing_info">Missing Info</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {needsComment && (
                  <div className="space-y-2">
                    <Label htmlFor={`comment-${provider.id}`}>Comment (required)</Label>
                    <Textarea
                      id={`comment-${provider.id}`}
                      placeholder="Explain what is missing or why the application was rejected..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={() => void handleSubmit()} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit Review
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminApprovalsPage() {
  const [roleFilter, setRoleFilter] = useState<ProviderRoleFilterId>("all");
  const [approvals, setApprovals] = useState<ProviderApprovalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApprovals(await fetchApprovals(roleFilter));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    void loadApprovals();
  }, [loadApprovals]);

  return (
    <AdminLayout
      title="Provider Approvals"
      subtitle="Review new provider applications before they can start accepting jobs"
    >
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Provider</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Applied</th>
              </tr>
            </thead>
            <tbody>
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No pending approvals for this filter.
                  </td>
                </tr>
              ) : (
                approvals.map((provider) => (
                  <ApprovalRowPanel key={provider.id} provider={provider} onSubmitted={() => void loadApprovals()} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
