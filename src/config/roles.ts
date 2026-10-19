import type { RoleConfig, RoleId } from "@/types";

export const ROLES: RoleConfig[] = [
  {
    id: "contact-centre-agent",
    label: "Contact-centre agent",
    appIds: [
      "booking-tools",
      "crm",
      "supplier-portal",
      "learning-platform",
      "facilities-requests",
      "hr-self-service",
    ],
  },
  {
    id: "travel-consultant",
    label: "Travel consultant",
    appIds: [
      "booking-tools",
      "supplier-portal",
      "crm",
      "learning-platform",
      "hr-self-service",
    ],
  },
  {
    id: "facilities-technician",
    label: "Facilities technician",
    appIds: ["facilities-requests", "hr-self-service", "learning-platform"],
  },
  {
    id: "academy-trainer",
    label: "Academy trainer",
    appIds: ["learning-platform", "crm", "hr-self-service"],
  },
];

export const ROLES_BY_ID = Object.fromEntries(
  ROLES.map((r) => [r.id, r]),
) as Record<RoleId, RoleConfig>;
