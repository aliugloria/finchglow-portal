import type { CompanyConfig, CompanyId } from "@/types";

/**
 * Adding a subsidiary = adding one entry here (plus mock content).
 * No component changes needed: theming is applied as CSS variables.
 * Every accent reaches 4.5:1 against white; check new ones before adding.
 */
export const COMPANIES: CompanyConfig[] = [
  {
    id: "group",
    name: "Group-wide",
    shortName: "Group-wide",
    description: "All companies, departments and brands",
    portalTitle: "Finchglow Holdings Group Staff Portal",
    icon: "globe",
    bannerImage: "/home-banner.webp",
    theme: {
      accent: "#0B5C9E",
      accentDark: "#0B2A45",
      accentSoft: "#E6F0FA",
      onAccent: "#FFFFFF",
    },
  },

  {
    id: "holidays",
    name: "Holidays",
    shortName: "Holidays",
    description: "Holiday operations",
    portalTitle: "Finchglow Holidays Staff Portal",
    icon: "sun",
    bannerImage: "/holiday-banner.webp",
    theme: {
      accent: "#C2410C",
      accentDark: "#7C2D12",
      accentSoft: "#FDEBDD",
      onAccent: "#FFFFFF",
    },
  },
  {
    id: "ota",
    name: "OTA",
    shortName: "OTA",
    description: "Online travel agency",
    portalTitle: "Finchglow OTA Staff Portal",
    icon: "plane",
    theme: {
      accent: "#1D4ED8",
      accentDark: "#1E3A8A",
      accentSoft: "#E5ECFD",
      onAccent: "#FFFFFF",
    },
  },
  {
    id: "academy",
    name: "Academy",
    shortName: "Academy",
    description: "Learning and development",
    portalTitle: "Finchglow Academy Staff Portal",
    icon: "graduation-cap",
    theme: {
      accent: "#6D28D9",
      accentDark: "#4C1D95",
      accentSoft: "#EFE7FB",
      onAccent: "#FFFFFF",
    },
  },
  {
    id: "b2b",
    name: "B2B Platform",
    shortName: "B2B",
    description: "Agent platform",
    portalTitle: "Finchglow B2B Staff Portal",
    icon: "network",
    theme: {
      accent: "#0F766E",
      accentDark: "#134E4A",
      accentSoft: "#E0F4F1",
      onAccent: "#FFFFFF",
    },
  },
  {
    id: "tmc",
    name: "TMC",
    shortName: "TMC",
    description: "Corporate travel",
    portalTitle: "Finchglow TMC Staff Portal",
    icon: "briefcase",
    theme: {
      accent: "#9D174D",
      accentDark: "#831843",
      accentSoft: "#FBE7F0",
      onAccent: "#FFFFFF",
    },
  },

  {
    id: "facilities",
    name: "Shared Facilities",
    shortName: "Facilities",
    description: "Shared facilities and support",
    portalTitle: "Finchglow Facilities Staff Portal",
    icon: "building",
    theme: {
      accent: "#475569",
      accentDark: "#1E293B",
      accentSoft: "#E8EDF3",
      onAccent: "#FFFFFF",
    },
  },
];

export const COMPANIES_BY_ID = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
) as Record<CompanyId, CompanyConfig>;
