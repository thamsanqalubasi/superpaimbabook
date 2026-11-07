import React, { useState } from "react";
import {
  Building2,
  SlidersHorizontal,
  Compass,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  INITIAL_COMPANIES,
  INITIAL_SYSTEM_CONTROLS,
  INITIAL_AFFILIATE_PROPERTIES,
  INITIAL_INQUIRIES,
} from "../data/mock-data";

export function OverviewPage() {
  const [controls] = useState(INITIAL_SYSTEM_CONTROLS);
  const [companies] = useState(INITIAL_COMPANIES);
  const [affiliates] = useState(INITIAL_AFFILIATE_PROPERTIES);
  const [inquiries] = useState(INITIAL_INQUIRIES);

  const activeControlsCount = controls.filter((c) => c.isEnabled).length;
  const totalAffiliateClicks = affiliates.reduce((sum, a) => sum + a.clicksCount, 0);
  const totalAffiliateEarnings = affiliates.reduce((sum, a) => sum + a.estimatedEarnings, 0);
  const openInquiriesCount = inquiries.filter((i) => i.status === "open").length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Platform Master Console
          </h1>
          <p className="text-xs text-muted mt-1">
            Top-level backend administration for Paimbabook global operations, affiliate distribution, and company incubation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/controls"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
          >
            <SlidersHorizontal size={14} />
            <span>Open 20 Controls</span>
          </Link>
          <Link
            to="/companies"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-color bg-surface hover:bg-surface-elevated text-xs font-bold text-foreground transition"
          >
            <Building2 size={14} />
            <span>Manage Companies</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold">Managed Companies</span>
            <Building2 size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {companies.length}
          </div>
          <div className="text-[11px] text-muted flex items-center gap-1">
            <span className="text-emerald-600 font-bold">
              {companies.filter((c) => c.ownershipType === "internal_incubated").length} Incubating
            </span>
            <span>· 1 Handed Over</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold">Super Controls Active</span>
            <SlidersHorizontal size={18} className="text-purple-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {activeControlsCount} / {controls.length}
          </div>
          <div className="text-[11px] text-muted">
            All 20 master safeguards online
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold">Affiliate Link Clicks</span>
            <Compass size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {totalAffiliateClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} />
            R {totalAffiliateEarnings.toLocaleString()} estimated commissions
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold">Cross-Company Inquiries</span>
            <MessageSquare size={18} className="text-red-500" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {openInquiriesCount} Open
          </div>
          <div className="text-[11px] text-muted">
            Needs triage across managed hotels
          </div>
        </div>
      </div>

      {/* Instant Action & Emergency Bar */}
      <div className="p-4 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-purple-600" />
            <h3 className="text-sm font-bold text-foreground">
              Direct Stealth Login & Handover Portal
            </h3>
          </div>
          <p className="text-xs text-muted max-w-2xl">
            Access any hotel, motel, or lodge desk with 1-click stealth impersonation. Your sessions and updates will not be logged in client audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/companies"
            className="px-4 py-2 rounded-xl bg-surface border border-border-color hover:bg-surface-elevated text-xs font-bold text-foreground transition"
          >
            Open Company Directory →
          </Link>
        </div>
      </div>

      {/* Two-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Managed Companies Snapshot */}
        <div className="p-5 rounded-2xl border border-border-color bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" />
              Active Partner & Incubated Companies
            </h3>
            <Link to="/companies" className="text-xs font-bold text-purple-600 hover:underline">
              View All ({companies.length})
            </Link>
          </div>
          <div className="space-y-2.5">
            {companies.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                className="p-3 rounded-xl border border-border-color bg-surface-elevated/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{comp.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        comp.ownershipType === "internal_incubated"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : comp.ownershipType === "handed_over"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }`}
                    >
                      {comp.ownershipType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    {comp.city}, {comp.country} · {comp.propertiesCount} Properties ({comp.roomsCount} Rooms)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground">
                    {comp.platformCommissionRate}% Comm
                  </span>
                  <p className="text-[10px] text-muted">
                    Est. R {(comp.monthlyRevenueEstimate * comp.platformCommissionRate / 100).toLocaleString()}/mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Live Deals Snapshot */}
        <div className="p-5 rounded-2xl border border-border-color bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Compass size={16} className="text-amber-500" />
              Tourism Affiliate Deals (Booking.com & Direct)
            </h3>
            <Link to="/affiliates" className="text-xs font-bold text-purple-600 hover:underline">
              Manage APIs & Deals
            </Link>
          </div>
          <div className="space-y-2.5">
            {affiliates.slice(0, 3).map((aff) => (
              <div
                key={aff.id}
                className="p-3 rounded-xl border border-border-color bg-surface-elevated/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={aff.thumbnailUrl}
                    alt={aff.propertyName}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {aff.propertyName}
                    </p>
                    <p className="text-[11px] text-muted">
                      {aff.city}, {aff.country} · {aff.provider.replace("_", ".")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-600">
                    R {aff.pricePerNight.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-muted">{aff.clicksCount} clicks tracked</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
