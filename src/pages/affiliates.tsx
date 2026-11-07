import React, { useState } from "react";
import {
  Compass,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Check,
  Tag,
  Percent,
  Sliders,
  DollarSign,
  TrendingUp,
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Settings2,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";
import { AffiliateProperty, AffiliateProvider, AffiliateConnection } from "../types";
import {
  INITIAL_AFFILIATE_PROPERTIES,
  INITIAL_AFFILIATE_CONNECTIONS,
} from "../data/mock-data";

export function AffiliatesPage() {
  const [activeTab, setActiveTab] = useState<"connections" | "inventory">("connections");

  // API Connections State
  const [connections, setConnections] = useState<AffiliateConnection[]>(() => {
    const saved = localStorage.getItem("super_affiliate_connections");
    return saved ? JSON.parse(saved) : INITIAL_AFFILIATE_CONNECTIONS;
  });

  // Properties State
  const [properties, setProperties] = useState<AffiliateProperty[]>(() => {
    const saved = localStorage.getItem("super_affiliates_list");
    return saved ? JSON.parse(saved) : INITIAL_AFFILIATE_PROPERTIES;
  });

  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [displayFilter, setDisplayFilter] = useState<"all" | "discount_only" | "curated_only">("all");
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Modals
  const [addConnModalOpen, setAddConnModalOpen] = useState(false);
  const [editRulesConn, setEditRulesConn] = useState<AffiliateConnection | null>(null);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);

  // New Connection Form
  const [newConnName, setNewConnName] = useState("");
  const [newConnProvider, setNewConnProvider] = useState<AffiliateProvider>("booking_com");
  const [newConnAffiliateId, setNewConnAffiliateId] = useState("");
  const [newConnApiKey, setNewConnApiKey] = useState("");
  const [newConnSecret, setNewConnSecret] = useState("");
  const [newConnEndpoint, setNewConnEndpoint] = useState("");
  const [newConnCommission, setNewConnCommission] = useState("8.5");
  const [newConnEnv, setNewConnEnv] = useState<"production" | "sandbox">("production");

  // New Property Form
  const [newTitle, setNewTitle] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("South Africa");
  const [newDealProvider, setNewDealProvider] = useState<AffiliateProvider>("booking_com");
  const [newPrice, setNewPrice] = useState("3500");
  const [newOriginalPrice, setNewOriginalPrice] = useState("4500");
  const [newLink, setNewLink] = useState("");
  const [newPhoto, setNewPhoto] = useState("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
  const [newDealCommission, setNewDealCommission] = useState("8.5");

  const saveConnections = (data: AffiliateConnection[]) => {
    setConnections(data);
    localStorage.setItem("super_affiliate_connections", JSON.stringify(data));
  };

  const saveProperties = (data: AffiliateProperty[]) => {
    setProperties(data);
    localStorage.setItem("super_affiliates_list", JSON.stringify(data));
  };

  const handleToggleConnection = (id: string) => {
    const updated = connections.map((c) =>
      c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
    );
    saveConnections(updated);
  };

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AffiliateConnection = {
      id: `conn-${Date.now()}`,
      provider: newConnProvider,
      name: newConnName,
      affiliateId: newConnAffiliateId,
      apiKey: newConnApiKey,
      apiSecret: newConnSecret,
      endpointUrl: newConnEndpoint,
      status: "connected",
      isEnabled: true,
      environment: newConnEnv,
      commissionRate: parseFloat(newConnCommission) || 8.0,
      displayRules: {
        showOnlyDiscounted: false,
        cheapestFirst: false,
        minimumStarRating: 3,
        maxResultsPerCity: 15,
        countriesAllowed: ["South Africa", "Zambia", "Namibia"],
        showCuratedBanner: true,
      },
      lastSyncedAt: new Date().toISOString(),
      totalOutboundClicks: 0,
      totalBookingsGenerated: 0,
      totalCommissionsEarned: 0,
    };

    saveConnections([created, ...connections]);
    setAddConnModalOpen(false);
    setNewConnName("");
    setNewConnAffiliateId("");
    setNewConnApiKey("");
  };

  const handleUpdateRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRulesConn) return;

    const updated = connections.map((c) =>
      c.id === editRulesConn.id ? editRulesConn : c
    );
    saveConnections(updated);
    setEditRulesConn(null);
  };

  const handleSyncAPIs = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Booking.com, Expedia & Partner APIs polled. Live prices and active room availability synchronized.");
    }, 1200);
  };

  const handleToggleCurated = (id: string) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, curatedShowcase: !p.curatedShowcase } : p
    );
    saveProperties(updated);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newPrice) || 2000;
    const orig = parseFloat(newOriginalPrice) || 0;
    const isDisc = orig > price;
    const discPct = isDisc ? Math.round(((orig - price) / orig) * 100) : 0;

    const created: AffiliateProperty = {
      id: `aff-${Date.now()}`,
      provider: newDealProvider,
      externalId: `ext-${Date.now().toString().slice(-6)}`,
      title: newTitle,
      propertyName: newTitle,
      country: newCountry,
      city: newCity || "Main Destination",
      starRating: 5,
      pricePerNight: price,
      originalPrice: orig > 0 ? orig : undefined,
      isDiscounted: isDisc,
      discountPercentage: discPct,
      curatedShowcase: true,
      deepLink: newLink || "https://www.booking.com",
      thumbnailUrl: newPhoto,
      commissionRate: parseFloat(newDealCommission) || 8.0,
      clicksCount: 0,
      estimatedEarnings: 0,
      status: "active",
      lastSyncedAt: new Date().toISOString(),
    };

    saveProperties([created, ...properties]);
    setAddDealModalOpen(false);
    setNewTitle("");
    setNewLink("");
  };

  const totalClicks = connections.reduce((sum, c) => sum + c.totalOutboundClicks, 0);
  const totalEarnings = connections.reduce((sum, c) => sum + c.totalCommissionsEarned, 0);

  const filtered = properties.filter((p) => {
    if (providerFilter !== "all" && p.provider !== providerFilter) return false;
    if (displayFilter === "discount_only" && !p.isDiscounted) return false;
    if (displayFilter === "curated_only" && !p.curatedShowcase) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.propertyName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Compass size={24} className="text-amber-500" />
            Tourism Affiliates &amp; Multi-API Control Hub
          </h1>
          <p className="text-xs text-muted mt-1">
            Configure partner API keys (Booking.com AID, Expedia EPS, TripAdvisor), toggle feeds ON/OFF, and define display curation rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAPIs}
            disabled={syncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-color bg-surface hover:bg-surface-elevated text-xs font-bold text-foreground transition"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin text-purple-600" : ""} />
            <span>{syncing ? "Syncing Feeds..." : "Sync Live Inventory"}</span>
          </button>
          <button
            onClick={() => setAddConnModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Key size={14} />
            <span>Connect New API</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Connected APIs</span>
          <div className="text-2xl font-black text-foreground">
            {connections.filter((c) => c.isEnabled).length} / {connections.length} Online
          </div>
          <p className="text-[11px] text-muted">
            Booking.com, Expedia Rapid, TripAdvisor
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Outbound Affiliate Referrals</span>
          <div className="text-2xl font-black text-purple-600">
            {totalClicks.toLocaleString()} Clicks
          </div>
          <p className="text-[11px] text-muted">Tracked outbound redirects with our AID</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Total Affiliate Commissions</span>
          <div className="text-2xl font-black text-emerald-600">
            R {totalEarnings.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted">Calculated based on confirmed bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-color">
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "connections"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Key size={14} />
          <span>API Key Management &amp; Display Rules ({connections.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "inventory"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Layers size={14} />
          <span>Curated Deals &amp; Properties ({properties.length})</span>
        </button>
      </div>

      {/* ── TAB 1: API CONNECTIONS & DISPLAY RULES ── */}
      {activeTab === "connections" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className={`p-5 rounded-2xl border transition space-y-4 shadow-xs flex flex-col justify-between ${
                  conn.isEnabled
                    ? "border-border-color bg-surface"
                    : "border-border-color/60 bg-surface-elevated/40 opacity-75"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          {conn.provider.replace("_", ".")}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {conn.environment}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground mt-1">
                        {conn.name}
                      </h3>
                    </div>

                    {/* Quick ON / OFF toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleConnection(conn.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        conn.isEnabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                      title={conn.isEnabled ? "Disable this API" : "Enable this API"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          conn.isEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-elevated/50 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-muted">
                      <span>Affiliate ID (AID):</span>
                      <strong className="text-foreground">{conn.affiliateId}</strong>
                    </div>
                    <div className="flex items-center justify-between text-muted">
                      <span>API Key:</span>
                      <strong className="text-foreground">
                        {conn.apiKey ? `${conn.apiKey.slice(0, 8)}...` : "None configured"}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-muted">
                      <span>Commission Split:</span>
                      <strong className="text-emerald-600">{conn.commissionRate}%</strong>
                    </div>
                  </div>

                  {/* Display Rules Summary */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-foreground text-[11px] block">
                      Active Portal Display Rules:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {conn.displayRules.showOnlyDiscounted && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold">
                          Discounts Only
                        </span>
                      )}
                      {conn.displayRules.cheapestFirst && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
                          Cheapest First
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border-color text-muted">
                        Min ★{conn.displayRules.minimumStarRating}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border-color text-muted">
                        Limit {conn.displayRules.maxResultsPerCity}/city
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-color flex items-center justify-between">
                  <div className="text-[11px] text-muted">
                    {conn.totalOutboundClicks} Outbound Clicks
                  </div>
                  <button
                    onClick={() => setEditRulesConn(conn)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 bg-surface hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold"
                  >
                    <Settings2 size={13} />
                    <span>Display Rules &amp; Keys</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: INVENTORY & CURATED DEALS ── */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border-color bg-surface">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[220px]">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search affiliate hotels, cities, destinations..."
                  className="w-full bg-surface-elevated border border-border-color rounded-xl pl-8 pr-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
                />
              </div>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
              >
                <option value="all">All Providers</option>
                <option value="booking_com">Booking.com</option>
                <option value="expedia">Expedia</option>
                <option value="direct_partner">Direct Partner</option>
              </select>
              <select
                value={displayFilter}
                onChange={(e) => setDisplayFilter(e.target.value as any)}
                className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
              >
                <option value="all">Display: All Properties</option>
                <option value="discount_only">Discounts Only (Special Deals)</option>
                <option value="curated_only">Curated for Portal Home</option>
              </select>
            </div>
            <button
              onClick={() => setAddDealModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus size={14} />
              <span>Add Custom Affiliate Deal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prop) => (
              <div
                key={prop.id}
                className="rounded-2xl border border-border-color bg-surface overflow-hidden shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video">
                    <img
                      src={prop.thumbnailUrl}
                      alt={prop.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/70 text-white">
                      {prop.provider.replace("_", ".")}
                    </span>
                    {prop.isDiscounted && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                        {prop.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-foreground leading-snug">
                        {prop.propertyName}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-emerald-600">
                          R {prop.pricePerNight.toLocaleString()}
                        </span>
                        {prop.originalPrice && (
                          <span className="block text-[10px] text-muted line-through">
                            R {prop.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted">
                      {prop.city}, {prop.country}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border-color">
                      <span>Commission: <strong className="text-foreground">{prop.commissionRate}%</strong></span>
                      <span className="text-purple-600 font-bold">{prop.clicksCount} Outbound Clicks</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleCurated(prop.id)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      prop.curatedShowcase
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-border-color text-muted hover:bg-surface-elevated"
                    }`}
                  >
                    {prop.curatedShowcase ? "Curated on Home" : "Add to Curated"}
                  </button>

                  <a
                    href={prop.deepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border-color hover:bg-surface-elevated text-xs font-semibold text-foreground"
                    title="Test Redirect & Affiliate Tracking"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: CONNECT NEW API ── */}
      {addConnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Connect Tourism Affiliate API (Booking.com, Expedia, etc.)
            </h3>
            <form onSubmit={handleCreateConnection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Integration Display Name *</label>
                <input
                  required
                  value={newConnName}
                  onChange={(e) => setNewConnName(e.target.value)}
                  placeholder="e.g. Booking.com Partner Network (Demand API)"
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Provider Platform *</label>
                  <select
                    value={newConnProvider}
                    onChange={(e) => setNewConnProvider(e.target.value as any)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  >
                    <option value="booking_com">Booking.com</option>
                    <option value="expedia">Expedia Partner Solutions</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="direct_partner">Direct Group API</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Environment</label>
                  <select
                    value={newConnEnv}
                    onChange={(e) => setNewConnEnv(e.target.value as any)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  >
                    <option value="production">Production (Live)</option>
                    <option value="sandbox">Sandbox / Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Affiliate ID / AID / Partner ID *</label>
                  <input
                    required
                    value={newConnAffiliateId}
                    onChange={(e) => setNewConnAffiliateId(e.target.value)}
                    placeholder="e.g. 2489104"
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Commission Rate (%) *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newConnCommission}
                    onChange={(e) => setNewConnCommission(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">API Key / Client Key</label>
                <input
                  type="password"
                  value={newConnApiKey}
                  onChange={(e) => setNewConnApiKey(e.target.value)}
                  placeholder="bk_live_..."
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Endpoint URL (Optional)</label>
                <input
                  type="url"
                  value={newConnEndpoint}
                  onChange={(e) => setNewConnEndpoint(e.target.value)}
                  placeholder="https://distribution-xml.booking.com/..."
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setAddConnModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save &amp; Activate API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT DISPLAY RULES & KEYS ── */}
      {editRulesConn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-foreground">
              Configure Display Rules &amp; Keys: {editRulesConn.name}
            </h3>
            <form onSubmit={handleUpdateRules} className="space-y-4 text-xs">
              <div className="space-y-2 p-3 rounded-xl bg-surface-elevated/40 border border-border-color">
                <label className="block font-bold text-foreground">
                  Portal Display Filtering
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRulesConn.displayRules.showOnlyDiscounted}
                    onChange={(e) =>
                      setEditRulesConn({
                        ...editRulesConn,
                        displayRules: {
                          ...editRulesConn.displayRules,
                          showOnlyDiscounted: e.target.checked,
                        },
                      })
                    }
                  />
                  <span>Show only properties on discount / special offers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRulesConn.displayRules.cheapestFirst}
                    onChange={(e) =>
                      setEditRulesConn({
                        ...editRulesConn,
                        displayRules: {
                          ...editRulesConn.displayRules,
                          cheapestFirst: e.target.checked,
                        },
                      })
                    }
                  />
                  <span>Order results: Cheapest price first</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRulesConn.displayRules.showCuratedBanner}
                    onChange={(e) =>
                      setEditRulesConn({
                        ...editRulesConn,
                        displayRules: {
                          ...editRulesConn.displayRules,
                          showCuratedBanner: e.target.checked,
                        },
                      })
                    }
                  />
                  <span>Feature as "Verified Partner" on main homepage carousel</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Minimum Star Rating</label>
                  <select
                    value={editRulesConn.displayRules.minimumStarRating}
                    onChange={(e) =>
                      setEditRulesConn({
                        ...editRulesConn,
                        displayRules: {
                          ...editRulesConn.displayRules,
                          minimumStarRating: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  >
                    <option value="1">1 Star &amp; Above</option>
                    <option value="2">2 Stars &amp; Above</option>
                    <option value="3">3 Stars &amp; Above</option>
                    <option value="4">4 Stars &amp; Above</option>
                    <option value="5">5 Stars Luxury Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Properties Per City</label>
                  <input
                    type="number"
                    value={editRulesConn.displayRules.maxResultsPerCity}
                    onChange={(e) =>
                      setEditRulesConn({
                        ...editRulesConn,
                        displayRules: {
                          ...editRulesConn.displayRules,
                          maxResultsPerCity: parseInt(e.target.value) || 10,
                        },
                      })
                    }
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Affiliate AID (Affiliate ID)</label>
                <input
                  value={editRulesConn.affiliateId}
                  onChange={(e) =>
                    setEditRulesConn({ ...editRulesConn, affiliateId: e.target.value })
                  }
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setEditRulesConn(null)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save Rules &amp; Update Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD DEAL ── */}
      {addDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Add Affiliate / Direct Partner Deal
            </h3>
            <form onSubmit={handleAddDeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Property Name *</label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Radisson Blu Waterfront"
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Provider Source</label>
                  <select
                    value={newDealProvider}
                    onChange={(e) => setNewDealProvider(e.target.value as any)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  >
                    <option value="booking_com">Booking.com</option>
                    <option value="expedia">Expedia</option>
                    <option value="direct_partner">Direct Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newDealCommission}
                    onChange={(e) => setNewDealCommission(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nightly Rate (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Original Price (For Discount %)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Affiliate Direct Deep Link *</label>
                <input
                  required
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://www.booking.com/hotel/..."
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setAddDealModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
