export const PROVIDER_ROLE_FILTERS = [
  { id: "all", label: "All Providers" },
  { id: "plumber", label: "Plumbers" },
  { id: "electrician", label: "Electricians" },
  { id: "garage", label: "Garages" },
  { id: "pestcontrol", label: "Pest Control" },
  { id: "washer", label: "Car Washers" },
] as const;

export type ProviderRoleFilterId = (typeof PROVIDER_ROLE_FILTERS)[number]["id"];
