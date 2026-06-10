import { apiRequest } from "@/lib/api";
import type { ProviderRoleFilterId } from "@/lib/provider-roles";

export type InvitationRow = {
  id: number;
  email: string;
  providerRole: string;
  providerRoleLabel: string;
  status: string;
  invitedBy: string;
  createdAt: string;
  acceptedAt: string | null;
};

export type ApprovalReply = {
  id: number;
  authorName: string;
  authorType: string;
  message: string;
  createdAt: string;
};

export type ProviderApprovalRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  providerRole: string;
  providerRoleLabel: string;
  serviceCategory: string;
  specialty: string;
  status: string;
  joined: string;
  latestAction: string | null;
  latestComment: string | null;
  latestReviewedAt: string | null;
  replies: ApprovalReply[];
};

export type ProviderApprovalStatus = {
  status: string;
  latestAction: string | null;
  latestComment: string | null;
  latestReviewedAt: string | null;
  canReply: boolean;
  canResubmit: boolean;
  replies: ApprovalReply[];
};

export function fetchInvitations(role: ProviderRoleFilterId = "all") {
  const query = role === "all" ? "" : `?role=${role}`;
  return apiRequest<InvitationRow[]>(`/admin/invitations${query}`);
}

export function createInvitation(email: string, providerRole: string) {
  return apiRequest<InvitationRow>("/admin/invitations", {
    method: "POST",
    body: JSON.stringify({ email, providerRole }),
  });
}

export function fetchApprovals(role: ProviderRoleFilterId = "all") {
  const query = role === "all" ? "" : `?role=${role}`;
  return apiRequest<ProviderApprovalRow[]>(`/admin/approvals${query}`);
}

export function submitApprovalReview(
  providerId: string,
  action: "approve" | "reject" | "missing_info",
  comment?: string
) {
  return apiRequest<ProviderApprovalRow>(`/admin/approvals/${providerId}/review`, {
    method: "POST",
    body: JSON.stringify({ action, comment }),
  });
}

export function fetchProviderApprovalStatus() {
  return apiRequest<ProviderApprovalStatus>("/provider/approval-status");
}

export function replyToApprovalReview(message: string) {
  return apiRequest<ProviderApprovalStatus>("/provider/approval-status/reply", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
