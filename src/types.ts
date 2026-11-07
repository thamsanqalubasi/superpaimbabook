export type SuperRole = "super_user" | "sub_super" | "company_manager";

export type SuperPermissionKey =
  | "admins_manage"
  | "companies_view_all"
  | "companies_stealth_login"
  | "companies_create_internal"
  | "companies_handover"
  | "controls_emergency_freeze"
  | "controls_regional"
  | "controls_module_toggles"
  | "affiliates_manage_apis"
  | "affiliates_curate_deals"
  | "finances_commissions_view"
  | "inquiries_cross_company";

export type SuperAdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: SuperRole;
  isFullAccess: boolean;
  permissions: SuperPermissionKey[];
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  status: "active" | "suspended";
};

export type CompanyOwnershipType = "client_managed" | "internal_incubated" | "handed_over";

export type ManagedCompany = {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  continent: string;
  ownershipType: CompanyOwnershipType;
  assignedManagerId?: string;
  assignedManagerName?: string;
  status: "active" | "frozen" | "banned";
  propertiesCount: number;
  roomsCount: number;
  activeBookingsCount: number;
  monthlyRevenueEstimate: number;
  platformCommissionRate: number; // e.g. 5%
  createdAt: string;
  handedOverAt?: string;
  handedOverToEmail?: string;
};

export type SystemControlItem = {
  id: string;
  key: string;
  category: "emergency" | "regional" | "booking" | "modules" | "security";
  title: string;
  description: string;
  isEnabled: boolean; // true = feature is active/allowed, false = frozen/disabled
  scope: "global" | "continent" | "country" | "city" | "company";
  targetRegion?: string;
  scheduledCountdownEnd?: string | null;
  updatedAt: string;
  updatedBy: string;
};

export type AffiliateProvider = "booking_com" | "expedia" | "tripadvisor" | "airbnb" | "direct_partner";

export type AffiliateProperty = {
  id: string;
  provider: AffiliateProvider;
  externalId: string;
  title: string;
  propertyName: string;
  country: string;
  city: string;
  starRating: number;
  pricePerNight: number;
  originalPrice?: number;
  isDiscounted: boolean;
  discountPercentage?: number;
  curatedShowcase: boolean;
  deepLink: string;
  thumbnailUrl: string;
  commissionRate: number; // e.g. 8.5%
  clicksCount: number;
  estimatedEarnings: number;
  status: "active" | "hidden";
  lastSyncedAt: string;
};

export type CrossCompanyInquiry = {
  id: string;
  companyId: string;
  companyName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  subject: string;
  message: string;
  checkInDate?: string;
  checkOutDate?: string;
  assignedAdminId?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
};

export type SuperAuditLog = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetCompanyId?: string;
  targetCompanyName?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
};
