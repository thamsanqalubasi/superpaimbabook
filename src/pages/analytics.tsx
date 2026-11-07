import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Compass,
  Building2,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  MousePointerClick,
  Users,
  Eye,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Download,
} from "lucide-react";
import {
  AnalyticsTimeframe,
  VisitorLocationStat,
  AffiliateClickRank,
  CompanyPerformanceStat,
} from "../types";

export function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("7d");
  const [categoryTab, setCategoryTab] = useState<"affiliates" | "internal" | "locations">("affiliates");
  const [searchFilter, setSearchFilter] = useState("");

  // Multiplier depending on selected timeframe
  const timeframeMultipliers: Record<AnalyticsTimeframe, { mult: number; label: string; daysLabel: string }> = {
    "24h": { mult: 0.15, label: "Last 24 Hours", daysLabel: "24 Hours" },
    "2d": { mult: 0.28, label: "Last 2 Days (48h)", daysLabel: "2 Days" },
    "3d": { mult: 0.42, label: "Last 3 Days (72h)", daysLabel: "3 Days" },
    "7d": { mult: 1.0, label: "Last 7 Days (1 Week)", daysLabel: "1 Week" },
    "30d": { mult: 4.2, label: "Last 30 Days (1 Month)", daysLabel: "1 Month" },
    "6m": { mult: 24.5, label: "Last 6 Months", daysLabel: "6 Months" },
    "1y": { mult: 49.0, label: "Last 1 Year (12 Months)", daysLabel: "1 Year" },
  };

  const currentTf = timeframeMultipliers[timeframe];
  const m = currentTf.mult;

  // 1. High-Level Summary Metrics
  const totalSiteVisits = Math.round(18420 * m);
  const totalPropertyViews = Math.round(41280 * m);
  const totalOutboundAffiliateClicks = Math.round(2980 * m);
  const totalDirectCompanyBookings = Math.round(146 * m);
  const totalHoldReservations = Math.round(89 * m);
  const totalAffiliateCommissions = Math.round(28400 * m);

  // 2. Geographic Visitor Locations
  const baseLocations: VisitorLocationStat[] = [
    { country: "South Africa", countryCode: "ZA", city: "Johannesburg", visitsCount: Math.round(5200 * m), percentage: 28 },
    { country: "South Africa", countryCode: "ZA", city: "Cape Town", visitsCount: Math.round(3800 * m), percentage: 21 },
    { country: "United Kingdom", countryCode: "GB", city: "London", visitsCount: Math.round(2600 * m), percentage: 14 },
    { country: "United States", countryCode: "US", city: "New York", visitsCount: Math.round(1850 * m), percentage: 10 },
    { country: "Germany", countryCode: "DE", city: "Frankfurt / Berlin", visitsCount: Math.round(1420 * m), percentage: 8 },
    { country: "Namibia", countryCode: "NA", city: "Windhoek", visitsCount: Math.round(1120 * m), percentage: 6 },
    { country: "Zambia", countryCode: "ZM", city: "Lusaka / Livingstone", visitsCount: Math.round(980 * m), percentage: 5 },
    { country: "Netherlands", countryCode: "NL", city: "Amsterdam", visitsCount: Math.round(790 * m), percentage: 4 },
    { country: "Other Global Visitors", countryCode: "XX", city: "Worldwide", visitsCount: Math.round(660 * m), percentage: 4 },
  ];

  // 3. Ranked Affiliate Links (Most Clicked & Conversion Rate)
  const baseAffiliatesRank: AffiliateClickRank[] = [
    {
      propertyId: "aff-001",
      propertyName: "The Table Bay Hotel V&A Waterfront",
      provider: "booking_com",
      destination: "Cape Town, South Africa",
      clicksCount: Math.round(684 * m),
      conversionsCount: Math.round(48 * m),
      conversionRate: 7.0,
      commissionsEarned: Math.round(13340 * m),
      rank: 1,
      rankChange: "same",
    },
    {
      propertyId: "aff-002",
      propertyName: "Sabi Sabi Bush Lodge - Sabi Sands Luxury",
      provider: "booking_com",
      destination: "Kruger National Park, South Africa",
      clicksCount: Math.round(512 * m),
      conversionsCount: Math.round(32 * m),
      conversionRate: 6.2,
      commissionsEarned: Math.round(29800 * m),
      rank: 2,
      rankChange: "up",
    },
    {
      propertyId: "aff-003",
      propertyName: "Royal Livingstone Victoria Falls by Anantara",
      provider: "expedia",
      destination: "Livingstone, Zambia",
      clicksCount: Math.round(389 * m),
      conversionsCount: Math.round(24 * m),
      conversionRate: 6.1,
      commissionsEarned: Math.round(9520 * m),
      rank: 3,
      rankChange: "up",
    },
    {
      propertyId: "aff-004",
      propertyName: "Radisson Blu Hotel Waterfront",
      provider: "booking_com",
      destination: "Cape Town, South Africa",
      clicksCount: Math.round(340 * m),
      conversionsCount: Math.round(21 * m),
      conversionRate: 6.1,
      commissionsEarned: Math.round(6400 * m),
      rank: 4,
      rankChange: "down",
    },
    {
      propertyId: "aff-005",
      propertyName: "Chobe Safari Lodge Kasane",
      provider: "expedia",
      destination: "Chobe, Botswana",
      clicksCount: Math.round(270 * m),
      conversionsCount: Math.round(16 * m),
      conversionRate: 5.9,
      commissionsEarned: Math.round(7100 * m),
      rank: 5,
      rankChange: "same",
    },
    {
      propertyId: "aff-006",
      propertyName: "Swakopmund Hotel & Entertainment Centre",
      provider: "booking_com",
      destination: "Swakopmund, Namibia",
      clicksCount: Math.round(220 * m),
      conversionsCount: Math.round(13 * m),
      conversionRate: 5.9,
      commissionsEarned: Math.round(4200 * m),
      rank: 6,
      rankChange: "up",
    },
  ];

  // 4. Internal Companies vs External Partner Companies Clicks & Bookings
  const baseCompaniesPerf: CompanyPerformanceStat[] = [
    {
      companyId: "comp-001",
      companyName: "Paimba Grand Safari Lodge & Hotel",
      ownershipType: "internal_incubated",
      country: "South Africa",
      city: "Nelspruit / Kruger",
      viewsAndClicks: Math.round(3410 * m),
      holdReservations: Math.round(42 * m),
      confirmedBookings: Math.round(68 * m),
      conversionRate: 3.2,
      grossRevenue: Math.round(420000 * m),
      platformCommissionEarned: Math.round(21000 * m),
    },
    {
      companyId: "comp-002",
      companyName: "Cape Panorama Boutique Villas",
      ownershipType: "client_managed",
      country: "South Africa",
      city: "Cape Town",
      viewsAndClicks: Math.round(2840 * m),
      holdReservations: Math.round(28 * m),
      confirmedBookings: Math.round(44 * m),
      conversionRate: 2.5,
      grossRevenue: Math.round(310000 * m),
      platformCommissionEarned: Math.round(13950 * m),
    },
    {
      companyId: "comp-003",
      companyName: "Zambezi River Sun Lodge",
      ownershipType: "internal_incubated",
      country: "Zambia",
      city: "Livingstone",
      viewsAndClicks: Math.round(1950 * m),
      holdReservations: Math.round(18 * m),
      confirmedBookings: Math.round(26 * m),
      conversionRate: 2.2,
      grossRevenue: Math.round(180000 * m),
      platformCommissionEarned: Math.round(10800 * m),
    },
    {
      companyId: "comp-004",
      companyName: "Swakopmund Ocean Crest Suites",
      ownershipType: "handed_over",
      country: "Namibia",
      city: "Swakopmund",
      viewsAndClicks: Math.round(1280 * m),
      holdReservations: Math.round(11 * m),
      confirmedBookings: Math.round(19 * m),
      conversionRate: 2.3,
      grossRevenue: Math.round(95000 * m),
      platformCommissionEarned: Math.round(3800 * m),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Timeframe Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 size={24} className="text-purple-600" />
            Platform Traffic, Clicks &amp; Conversion Analytics
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time tracking of visitor traffic, geographical locations, ranked affiliate link clicks (Booking.com/Expedia), and internal/external hotel booking conversions.
          </p>
        </div>

        {/* Timeframe Pill Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border-color bg-surface shadow-xs shrink-0">
          <Calendar size={14} className="text-muted ml-2 mr-1" />
          {(
            [
              { key: "24h", label: "24h" },
              { key: "2d", label: "2 Days" },
              { key: "3d", label: "3 Days" },
              { key: "7d", label: "1 Week" },
              { key: "30d", label: "1 Month" },
              { key: "6m", label: "6 Months" },
              { key: "1y", label: "1 Year" },
            ] as const
          ).map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeframe === tf.key
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-muted hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Site Visits</span>
            <Users size={15} className="text-blue-500" />
          </div>
          <div className="text-xl font-black text-foreground">
            {totalSiteVisits.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted">{currentTf.label}</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Property Views</span>
            <Eye size={15} className="text-indigo-500" />
          </div>
          <div className="text-xl font-black text-foreground">
            {totalPropertyViews.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted">Direct + Affiliates</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Affiliate Clicks</span>
            <MousePointerClick size={15} className="text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600">
            {totalOutboundAffiliateClicks.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted">Outbound redirects</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Hold Reservations</span>
            <Calendar size={15} className="text-orange-500" />
          </div>
          <div className="text-xl font-black text-orange-600">
            {totalHoldReservations.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted">24-48h pending holds</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Confirmed Bookings</span>
            <CheckCircle2 size={15} className="text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600">
            {totalDirectCompanyBookings.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted">Direct platform stays</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-bold">Affiliate Comm.</span>
            <DollarSign size={15} className="text-emerald-500" />
          </div>
          <div className="text-xl font-black text-foreground">
            R {totalAffiliateCommissions.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">Booking.com / EPS</p>
        </div>
      </div>

      {/* Analytics Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border-color">
        <button
          onClick={() => setCategoryTab("affiliates")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            categoryTab === "affiliates"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Compass size={14} />
          <span>Affiliate Links Clicks &amp; Ranking ({baseAffiliatesRank.length})</span>
        </button>
        <button
          onClick={() => setCategoryTab("internal")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            categoryTab === "internal"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Building2 size={14} />
          <span>Internal vs External Companies Performance ({baseCompaniesPerf.length})</span>
        </button>
        <button
          onClick={() => setCategoryTab("locations")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            categoryTab === "locations"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Globe2 size={14} />
          <span>Visitor Geographical Locations ({baseLocations.length})</span>
        </button>
      </div>

      {/* ── TAB 1: AFFILIATE LINKS CLICKS & RANKING ── */}
      {categoryTab === "affiliates" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-500" />
                  Most Clicked Affiliate Properties &amp; Link Performance Rank ({currentTf.label})
                </h3>
                <p className="text-xs text-muted">
                  Ranked by outbound click volume to Booking.com, Expedia, and partner portals.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-color text-muted font-bold">
                    <th className="pb-3 text-center w-12">Rank</th>
                    <th className="pb-3">Property Name &amp; Destination</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3 text-right">Outbound Clicks</th>
                    <th className="pb-3 text-right">Conversions</th>
                    <th className="pb-3 text-right">Conv. Rate</th>
                    <th className="pb-3 text-right">Earned Comm. (ZAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {baseAffiliatesRank.map((aff) => (
                    <tr key={aff.propertyId} className="hover:bg-surface-elevated/40 transition">
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                            aff.rank === 1
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-300"
                              : aff.rank === 2
                              ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                              : aff.rank === 3
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
                              : "text-muted"
                          }`}
                        >
                          {aff.rank}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-foreground block">{aff.propertyName}</span>
                        <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {aff.destination}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          {aff.provider.replace("_", ".")}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-foreground">
                        {aff.clicksCount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-muted">
                        {aff.conversionsCount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-bold text-emerald-600">{aff.conversionRate}%</span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        R {aff.commissionsEarned.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: INTERNAL VS EXTERNAL COMPANIES PERFORMANCE ── */}
      {categoryTab === "internal" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                Company Engagement: Views, Hold Reservations &amp; Confirmed Bookings ({currentTf.label})
              </h3>
              <p className="text-xs text-muted">
                Track whether incubated internal companies or client-managed properties convert better over selected time windows.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-color text-muted font-bold">
                    <th className="pb-3">Company Name</th>
                    <th className="pb-3">Ownership Model</th>
                    <th className="pb-3 text-right">Views &amp; Clicks</th>
                    <th className="pb-3 text-right">Hold Reservations</th>
                    <th className="pb-3 text-right">Confirmed Bookings</th>
                    <th className="pb-3 text-right">Conversion %</th>
                    <th className="pb-3 text-right">Gross GMV</th>
                    <th className="pb-3 text-right">Platform Fee Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {baseCompaniesPerf.map((comp) => (
                    <tr key={comp.companyId} className="hover:bg-surface-elevated/40 transition">
                      <td className="py-3">
                        <span className="font-bold text-foreground block">{comp.companyName}</span>
                        <span className="text-[11px] text-muted">
                          {comp.city}, {comp.country}
                        </span>
                      </td>
                      <td className="py-3">
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
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-foreground">
                        {comp.viewsAndClicks.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-orange-600 font-bold">
                        {comp.holdReservations.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-emerald-600 font-bold">
                        {comp.confirmedBookings.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-bold text-foreground">
                        {comp.conversionRate}%
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-foreground">
                        R {comp.grossRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        R {comp.platformCommissionEarned.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: VISITOR GEOGRAPHICAL LOCATIONS ── */}
      {categoryTab === "locations" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe2 size={16} className="text-emerald-500" />
                Geographical Visitor Footprint &amp; Traffic Density ({currentTf.label})
              </h3>
              <p className="text-xs text-muted">
                Audience source breakdown by country and destination city to guide regional affiliate curation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {baseLocations.map((loc) => (
                <div
                  key={`${loc.countryCode}-${loc.city}`}
                  className="p-3.5 rounded-xl border border-border-color bg-surface-elevated/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border-color">
                        {loc.countryCode}
                      </span>
                      <strong className="text-foreground">{loc.city}</strong>
                      <span className="text-muted">({loc.country})</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {loc.visitsCount.toLocaleString()} visits ({loc.percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-surface border border-border-color overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                      style={{ width: `${Math.min(loc.percentage * 3.2, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
