export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: string;
};

export type ServicePerformance = {
  code: string;
  name: string;
  iconKey: string;
  jobs: number;
  revenue: string;
  providers: number;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  type: string;
  service: string | null;
  status: string;
  joined: string;
};

export type AdminTransactionRow = {
  id: number;
  customer: string;
  provider: string;
  service: string;
  amount: string;
  status: string;
  date: string;
};

export type AdminDashboard = {
  overviewStats: StatCard[];
  serviceStats: ServicePerformance[];
  recentUsers: AdminUserRow[];
  recentTransactions: AdminTransactionRow[];
  quickActions: { pendingVerifications: number; openDisputes: number };
};

export type ServiceItem = {
  id: string;
  code: string;
  title: string;
  iconKey: string;
  providers: number;
};

export type CustomerBooking = {
  id: number;
  service: string;
  provider: string;
  status: string;
  date: string;
  amount: number;
  rating: number | null;
};

export type NearbyProvider = {
  id: string;
  name: string;
  service: string;
  rating: number;
  jobs: number;
  distance: string;
  available: boolean;
};

export type CustomerDashboard = {
  services: ServiceItem[];
  recentBookings: CustomerBooking[];
  nearbyProviders: NearbyProvider[];
};

export type ProviderActiveJob = {
  id: number;
  customer: string;
  service: string;
  address: string;
  phone: string;
  startTime: string;
  description: string;
  estimatedPay: string;
};

export type ProviderRequest = {
  id: number;
  customer: string;
  service: string;
  address: string;
  date: string;
  time: string;
  distance: string;
  estimatedPay: string;
};

export type ProviderCompletedJob = {
  id: number;
  customer: string;
  service: string;
  amount: string;
  date: string;
  rating: number | null;
};

export type ProviderNotification = {
  id: number;
  message: string;
  time: string;
  unread: boolean;
};

export type ProviderDashboard = {
  stats: StatCard[];
  activeJob: ProviderActiveJob | null;
  pendingRequests: ProviderRequest[];
  completedJobs: ProviderCompletedJob[];
  notifications: ProviderNotification[];
};

export type ApiEndpoint = {
  method: string;
  path: string;
  description: string;
  role: string;
};

export type CreateBookingPayload = {
  serviceCode: string;
  providerId?: string;
  title: string;
  description?: string;
  address?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  amount: number;
  paymentMethod?: string;
};
