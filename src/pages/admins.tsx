import React, { useState } from "react";
import {
  Users,
  Plus,
  Shield,
  KeyRound,
  Check,
  Search,
  CheckSquare,
  Square,
  Building2,
} from "lucide-react";
import { SuperAdminUser, SuperRole, SuperPermissionKey } from "../types";
import { useSuperAuth } from "../context/auth-context";

const PERMISSION_DEFINITIONS: { key: SuperPermissionKey; label: string; desc: string }[] = [
  { key: "admins_manage", label: "Manage Administrators", desc: "Add new admins and assign roles" },
  { key: "companies_view_all", label: "View All Companies", desc: "Access company directory & financials" },
  { key: "companies_stealth_login", label: "Stealth Login", desc: "Enter company dashboard without client audit logs" },
  { key: "companies_create_internal", label: "Create Internal Companies", desc: "Launch new internal incubated companies" },
  { key: "companies_handover", label: "Company Handover", desc: "Transfer incubated companies to external clients" },
  { key: "controls_emergency_freeze", label: "Emergency Freeze Controls", desc: "Global and site-wide emergency toggle switches" },
  { key: "controls_regional", label: "Regional Controls", desc: "Continent, country, and city level access gates" },
  { key: "controls_module_toggles", label: "Module Toggles", desc: "Disable/enable HR, procurement, rental modules" },
  { key: "affiliates_manage_apis", label: "Affiliate APIs", desc: "Sync Booking.com and Expedia feeds" },
  { key: "affiliates_curate_deals", label: "Curate Deals", desc: "Choose discounted properties for portal home" },
  { key: "finances_commissions_view", label: "View Finances & Commissions", desc: "Calculate platform commissions" },
  { key: "inquiries_cross_company", label: "Cross-Company Inquiries", desc: "Triage inquiries across all properties" },
];

export function AdminsPage() {
  const { allAdmins, addAdmin, updateAdmin, currentUser } = useSuperAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<SuperRole>("sub_super");
  const [isFullAccess, setIsFullAccess] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<SuperPermissionKey[]>([
    "companies_view_all",
    "inquiries_cross_company",
  ]);

  const togglePermission = (key: SuperPermissionKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: SuperAdminUser = {
      id: `sa-${Date.now()}`,
      email,
      fullName,
      role,
      isFullAccess: role === "super_user" ? true : isFullAccess,
      permissions:
        role === "super_user" || isFullAccess
          ? PERMISSION_DEFINITIONS.map((p) => p.key)
          : selectedPermissions,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    addAdmin(newAdmin);
    setModalOpen(false);
    setEmail("");
    setFullName("");
    setIsFullAccess(false);
  };

  const filtered = allAdmins.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Users size={24} className="text-purple-600" />
            Super Administrator Governance
          </h1>
          <p className="text-xs text-muted mt-1">
            Add platform administrators, assign roles (Super User, Sub Super, Company Manager), and configure granular permissions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus size={14} />
          <span>Add New Administrator</span>
        </button>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((adm) => (
          <div
            key={adm.id}
            className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/10 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center">
                  {adm.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{adm.fullName}</h3>
                  <p className="text-xs text-muted">{adm.email}</p>
                </div>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  adm.role === "super_user"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : adm.role === "sub_super"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {adm.role.replace("_", " ")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>Access Level:</span>
                <strong className="text-foreground">
                  {adm.isFullAccess || adm.role === "super_user" ? "Full Master Access" : "Custom Permissions"}
                </strong>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Granted Permissions:</span>
                <strong className="text-foreground">
                  {adm.permissions.length} capability flags
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {adm.permissions.slice(0, 3).map((perm) => (
                <span
                  key={perm}
                  className="text-[9px] bg-surface-elevated border border-border-color px-2 py-0.5 rounded text-muted"
                >
                  {perm.replace(/_/g, " ")}
                </span>
              ))}
              {adm.permissions.length > 3 && (
                <span className="text-[9px] text-muted self-center">
                  +{adm.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-foreground">
              Add New Administrator &amp; Role Setup
            </h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tendai Moyo"
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tendai@paimbabook.com"
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Administrator Role Tier *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("super_user");
                      setIsFullAccess(true);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === "super_user"
                        ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 font-bold"
                        : "border-border-color bg-surface text-muted"
                    }`}
                  >
                    <p className="font-bold">Super User</p>
                    <p className="text-[10px] opacity-75">Full Root Access</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("sub_super")}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === "sub_super"
                        ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold"
                        : "border-border-color bg-surface text-muted"
                    }`}
                  >
                    <p className="font-bold">Sub Super</p>
                    <p className="text-[10px] opacity-75">Platform Operations</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("company_manager")}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === "company_manager"
                        ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold"
                        : "border-border-color bg-surface text-muted"
                    }`}
                  >
                    <p className="font-bold">Company Mgr</p>
                    <p className="text-[10px] opacity-75">Hospitality Lead</p>
                  </button>
                </div>
              </div>

              {/* Granular Permission Checklist */}
              <div className="space-y-2 pt-2 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">
                    Granular Permission Flags
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-purple-600 font-semibold">
                    <input
                      type="checkbox"
                      checked={isFullAccess || role === "super_user"}
                      onChange={(e) => setIsFullAccess(e.target.checked)}
                      disabled={role === "super_user"}
                    />
                    <span>Grant Full Access</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {PERMISSION_DEFINITIONS.map((perm) => {
                    const isChecked =
                      isFullAccess ||
                      role === "super_user" ||
                      selectedPermissions.includes(perm.key);

                    return (
                      <div
                        key={perm.key}
                        onClick={() => {
                          if (role !== "super_user" && !isFullAccess) {
                            togglePermission(perm.key);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition select-none ${
                          isChecked
                            ? "border-purple-500/50 bg-purple-500/10 text-foreground"
                            : "border-border-color bg-surface-elevated/40 text-muted"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare size={14} className="text-purple-600" />
                          ) : (
                            <Square size={14} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{perm.label}</p>
                          <p className="text-[10px] text-muted leading-tight">{perm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Create Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
