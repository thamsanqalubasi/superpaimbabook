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
} from "lucide-react";
import { AffiliateProperty, AffiliateProvider } from "../types";
import { INITIAL_AFFILIATE_PROPERTIES } from "../data/mock-data";

export function AffiliatesPage() {
  const [properties, setProperties] = useState<AffiliateProperty[]>(() => {
    const saved = localStorage.getItem("super_affiliates_list");
    return saved ? JSON.parse(saved) : INITIAL_AFFILIATE_PROPERTIES;
  });

  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [displayFilter, setDisplayFilter] = useState<"all" | "discount_only" | "curated_only">("all");
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Affiliate Form
  const [newTitle, setNewTitle] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("South Africa");
  const [newProvider, setNewProvider] = useState<AffiliateProvider>("booking_com");
  const [newPrice, setNewPrice] = useState("3500");
  const [newOriginalPrice, setNewOriginalPrice] = useState("4500");
  const [newLink, setNewLink] = useState("");
  const [newPhoto, setNewPhoto] = useState("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
  const [newCommission, setNewCommission] = useState("8.5");

  const saveProperties = (data: AffiliateProperty[]) => {
    setProperties(data);
    localStorage.setItem("super_affiliates_list", JSON.stringify(data));
  };

  const handleSyncAPIs = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Booking.com & Expedia Affiliate Inventory synchronized successfully.");
    }, 1200);
  };

  const handleToggleCurated = (id: string) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, curatedShowcase: !p.curatedShowcase } : p
    );
    saveProperties(updated);
  };

  const handleAddAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newPrice) || 2000;
    const orig = parseFloat(newOriginalPrice) || 0;
    const isDisc = orig > price;
    const discPct = isDisc ? Math.round(((orig - price) / orig) * 100) : 0;

    const created: AffiliateProperty = {
      id: `aff-${Date.now()}`,
      provider: newProvider,
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
      commissionRate: parseFloat(newCommission) || 8.0,
      clicksCount: 0,
      estimatedEarnings: 0,
      status: "active",
      lastSyncedAt: new Date().toISOString(),
    };

    saveProperties([created, ...properties]);
    setAddModalOpen(false);
    setNewTitle("");
    setNewLink("");
  };

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
            Affiliate Tourism &amp; Booking.com API Hub
          </h1>
          <p className="text-xs text-muted mt-1">
            Curate affiliate properties, manage commission % tracking, and control inventory displayed to portal visitors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAPIs}
            disabled={syncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-color bg-surface hover:bg-surface-elevated text-xs font-bold text-foreground transition"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin text-purple-600" : ""} />
            <span>{syncing ? "Syncing APIs..." : "Sync OTA Feeds"}</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus size={14} />
            <span>Add Affiliate Deal</span>
          </button>
        </div>
      </div>

      {/* Filter and Criteria Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-border-color bg-surface">
        <div className="relative flex-1 min-w-[220px]">
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
          <option value="all">All Providers (Booking.com, Expedia)</option>
          <option value="booking_com">Booking.com</option>
          <option value="expedia">Expedia</option>
          <option value="direct_partner">Direct Hospitality Partner</option>
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

      {/* Affiliate Grid */}
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
                title="Test Deep Link"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Affiliate Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">
              Add Affiliate / Direct Partner Property
            </h3>
            <form onSubmit={handleAddAffiliate} className="space-y-3 text-xs">
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
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value as any)}
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
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
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
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Add to Affiliate Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
