import {
  Bug,
  Car,
  Droplets,
  Settings,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  zap: Zap,
  settings: Settings,
  bug: Bug,
  car: Car,
  droplets: Droplets,
};

export function getServiceIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Wrench;
}

export const SERVICE_COLORS: Record<string, { color: string; bgColor: string }> = {
  PLUMBING: { color: "text-blue-400", bgColor: "bg-blue-500/10" },
  ELECTRICAL: { color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  GARAGE: { color: "text-orange-400", bgColor: "bg-orange-500/10" },
  PEST_CONTROL: { color: "text-red-400", bgColor: "bg-red-500/10" },
  CAR_WASH: { color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  BIKE_WASH: { color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

export function getServiceColors(code: string) {
  return SERVICE_COLORS[code] ?? { color: "text-primary", bgColor: "bg-primary/10" };
}
