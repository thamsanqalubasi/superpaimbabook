import React, { useState } from "react";
import {
  Building2,
  Plus,
  LogIn,
  Share2,
  Lock,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { ManagedCompany, CompanyOwnershipType } from "../types";
import { INITIAL_COMPANIES } from "../data/mock-data";
import { useSuperAuth } from "../context/auth-context";

export function CompaniesPage() {
  const { allAdmins, currentUser } = useSuperAuth();
  const [companies, setCompanies] = useState<ManagedCompany[]>(() => {
    const saved = localStorage.getItem("super_companies_list");
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [targetCompany, setTargetCompany] = useState<ManagedCompany | null>(null);

  // New Company Form State
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState("South Africa");
  const [newCity, setNewCity] = useState("");
  const [newOwnership, setNewOwnership] = useState<CompanyOwnershipType>("internal_incubated");
  const [newManagerId, setNewManagerId] = useState(currentUser.id);
  const [newCommission, setNewCommission] = useState("5.0");

  // Handover Form State
  const [handoverEmail, setHandoverEmail] = useState("");
  const [handoverName, setHandoverName] = useState("");

  const saveCompanies = (data: ManagedCompany[]) => {
    setCompanies(data);
    localStorage.setItem("super_companies_list", JSON.stringify(data));
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const mgr = allAdmins.find((a) => a.id === newManagerId);
    const created: ManagedCompany = {
      id: `comp-${Date.now()}`,
      name: newName,
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      country: newCountry,
      city: newCity || "Main City",
      continent: "Africa",
      ownershipType: newOwnership,
      assignedManagerId: mgr?.id,
      assignedManagerName: mgr?.fullName,
      status: "active",
      propertiesCount: 1,
      roomsCount: 12,
      activeBookingsCount: 0,
      monthlyRevenueEstimate: 120000,
      platformCommissionRate: parseFloat(newCommission) || 5.0,
      createdAt: new Date().toISOString(),
    };

    saveCompanies([created, ...companies]);
    setCreateModalOpen(false);
    setNewName("");
    setNewCity("");
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompany) return;

    const updated = companies.map((c) =>
      c.id === targetCompany.id
        ? {
            ...c,
            ownershipType: "handed_over" as const,
            handedOverAt: new Date().toISOString(),
            handedOverToEmail: handoverEmail,
          }
        : c
    );
    saveCompanies(updated);
    setHandoverModalOpen(false);
    setTargetCompany(null);
    setHandoverEmail("");
    setHandoverName("");
  };

  const handleStealthLogin = (comp: ManagedCompany) => {
    // Open company desk on main platform with stealth bypass token
    const stealthUrl = `https://paimbabook.com/login?stealth_token=super_${comp.id}&super_admin=${currentUser.id}&as_company=${comp.id}`;
    window.open(stealthUrl, "_blank");
  };

  const filtered = companies.filter((c) => {
    if (typeFilter !== "all" && c.ownershipType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Hospitality &amp; Company Directory
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage client hotel groups, launch internal incubated companies, and conduct 1-click stealth logins.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus size={14} />
          <span>Create Internal Company</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-border-color bg-surface">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, country, city..."
            className="w-full bg-surface-elevated border border-border-color rounded-xl pl-8 pr-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
        >
          <option value="all">All Ownership Types</option>
          <option value="internal_incubated">Internal Incubated (Managed by Paimbabook)</option>
          <option value="client_managed">Client Managed (Direct Hotel Partners)</option>
          <option value="handed_over">Handed Over</option>
        </select>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-4 hover:border-purple-400 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{comp.name}</h3>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      comp.ownershipType === "internal_incubated"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        : comp.ownershipType === "handed_over"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {comp.ownershipType.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  {comp.city}, {comp.country} · Commission:{" "}
                  <strong className="text-foreground">{comp.platformCommissionRate}%</strong>
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  comp.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {comp.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-elevated/40 text-xs text-muted">
              <div>
                <span className="block text-[10px]">Properties / Rooms</span>
                <strong className="text-foreground">
                  {comp.propertiesCount} Props · {comp.roomsCount} Rooms
                </strong>
              </div>
              <div>
                <span className="block text-[10px]">Active Bookings</span>
                <strong className="text-foreground">{comp.activeBookingsCount} Stays</strong>
              </div>
              <div>
                <span className="block text-[10px]">Assigned Manager</span>
                <strong className="text-foreground truncate block">
                  {comp.assignedManagerName || "Unassigned"}
                </strong>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-color">
              <button
                onClick={() => handleStealthLogin(comp)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs"
                title="Enter company desk with stealth isolation (no audit pollution)"
              >
                <LogIn size={13} />
                <span>Stealth Login</span>
              </button>

              <div className="flex items-center gap-2">
                {comp.ownershipType === "internal_incubated" && (
                  <button
                    onClick={() => {
                      setTargetCompany(comp);
                      setHandoverModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 bg-surface hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition"
                  >
                    <Share2 size={13} />
                    <span>Handover Company</span>
                  </button>
                )}
                <span className="text-[11px] text-muted font-mono">{comp.slug}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Company */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Create Internal / Partner Company
            </h3>
            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company / Group Name *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Victoria Falls Safari Grand Lodge"
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Country *</label>
                  <input
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City / Region *</label>
                  <input
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Livingstone"
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Ownership Model</label>
                  <select
                    value={newOwnership}
                    onChange={(e) => setNewOwnership(e.target.value as any)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  >
                    <option value="internal_incubated">Internal Incubated</option>
                    <option value="client_managed">Client Managed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Manager</label>
                <select
                  value={newManagerId}
                  onChange={(e) => setNewManagerId(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                >
                  {allAdmins.map((adm) => (
                    <option key={adm.id} value={adm.id}>
                      {adm.fullName} ({adm.role.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Launch Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Handover Company */}
      {handoverModalOpen && targetCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Handover Company to Client: {targetCompany.name}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              When partnering with hotels/lodges, we incubate the properties under our internal management. Once setup is complete, handover transfers administrative ownership to their executive staff.
            </p>
            <form onSubmit={handleHandoverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Client Executive Full Name *</label>
                <input
                  required
                  value={handoverName}
                  onChange={(e) => setHandoverName(e.target.value)}
                  placeholder="e.g. Michael Thorne (General Manager)"
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Client Admin Email *</label>
                <input
                  required
                  type="email"
                  value={handoverEmail}
                  onChange={(e) => setHandoverEmail(e.target.value)}
                  placeholder="e.g. gm@victoriafallslodge.com"
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Commission Continuity
                </div>
                <p className="text-[11px] opacity-90">
                  Platform commission rate of {targetCompany.platformCommissionRate}% will remain active on all future bookings after handover.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setHandoverModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm &amp; Complete Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
