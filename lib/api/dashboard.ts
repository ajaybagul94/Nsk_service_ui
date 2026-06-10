import { apiRequest } from "@/lib/api";
import type {
  AdminDashboard,
  ApiEndpoint,
  CreateBookingPayload,
  CustomerBooking,
  CustomerDashboard,
  ProviderDashboard,
} from "@/lib/api/types";

export function fetchAdminDashboard() {
  return apiRequest<AdminDashboard>("/admin/dashboard");
}

export function fetchAdminApiEndpoints() {
  return apiRequest<ApiEndpoint[]>("/admin/api/endpoints");
}

export function fetchCustomerDashboard() {
  return apiRequest<CustomerDashboard>("/customer/dashboard");
}

export function fetchCustomerApiEndpoints() {
  return apiRequest<ApiEndpoint[]>("/customer/api/endpoints");
}

export function createCustomerBooking(payload: CreateBookingPayload) {
  return apiRequest<CustomerBooking>("/customer/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchProviderDashboard() {
  return apiRequest<ProviderDashboard>("/provider/dashboard");
}

export function fetchProviderApiEndpoints() {
  return apiRequest<ApiEndpoint[]>("/provider/api/endpoints");
}

export function acceptProviderBooking(id: number) {
  return apiRequest<CustomerBooking>(`/provider/bookings/${id}/accept`, { method: "POST" });
}

export function declineProviderBooking(id: number) {
  return apiRequest<{ message: string }>(`/provider/bookings/${id}/decline`, { method: "POST" });
}

export function completeProviderBooking(
  id: number,
  body: { finalAmount: number; paymentMethod?: string; notes?: string }
) {
  return apiRequest<CustomerBooking>(`/provider/bookings/${id}/complete`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function markProviderNotificationsRead() {
  return apiRequest<{ updated: number }>("/provider/notifications/read-all", { method: "POST" });
}
