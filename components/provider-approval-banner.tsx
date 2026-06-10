"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, MessageSquare, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchProviderApprovalStatus,
  replyToApprovalReview,
  type ProviderApprovalStatus,
} from "@/lib/api/admin";

export function ProviderApprovalBanner() {
  const [status, setStatus] = useState<ProviderApprovalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await fetchProviderApprovalStatus());
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  if (loading) {
    return null;
  }

  if (!status || status.status === "active") {
    return null;
  }

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      setStatus(await replyToApprovalReview(reply.trim()));
      setReply("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reply");
    } finally {
      setSubmitting(false);
    }
  };

  const bannerStyles: Record<string, { border: string; bg: string; icon: React.ReactNode; title: string }> = {
    pending: {
      border: "border-yellow-500/50",
      bg: "bg-yellow-500/10",
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      title: "Application Under Review",
    },
    rejected: {
      border: "border-red-500/50",
      bg: "bg-red-500/10",
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      title: "Application Rejected",
    },
    missing_info: {
      border: "border-orange-500/50",
      bg: "bg-orange-500/10",
      icon: <AlertCircle className="h-5 w-5 text-orange-400" />,
      title: "Additional Information Required",
    },
  };

  const style = bannerStyles[status.status] ?? bannerStyles.pending;

  return (
    <div className={`mb-8 rounded-xl border ${style.border} ${style.bg} p-6`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{style.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {status.status === "pending"
              ? "Your provider account is waiting for admin approval. You cannot accept jobs until approved."
              : "Review the admin feedback below. You can reply to continue the review process."}
          </p>

          {status.latestComment && (
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Admin feedback</p>
              <p className="mt-1 text-sm text-foreground">{status.latestComment}</p>
              {status.latestReviewedAt && (
                <p className="mt-1 text-xs text-muted-foreground">{status.latestReviewedAt}</p>
              )}
            </div>
          )}

          {status.replies.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Your replies</p>
              {status.replies.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                  <p className="font-medium text-foreground">{item.authorName}</p>
                  <p className="mt-1 text-foreground">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          {status.canReply && (
            <div className="mt-4 space-y-3">
              <Textarea
                placeholder="Reply to admin with additional details or clarification..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={() => void handleReply()} disabled={submitting || !reply.trim()}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                Send Reply & Resubmit
              </Button>
              <p className="text-xs text-muted-foreground">
                Your reply will be sent to the admin and your application will return to pending review.
              </p>
            </div>
          )}

          {status.status === "pending" && !status.latestComment && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              We will notify you once a decision is made.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
