import React, { useState } from "react";
import {
  SlidersHorizontal,
  Power,
  Globe2,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { SystemControlItem } from "../types";
import { INITIAL_SYSTEM_CONTROLS } from "../data/mock-data";
import { useSuperAuth } from "../context/auth-context";

export function ControlsPage() {
  const { currentUser } = useSuperAuth();
  const [controls, setControls] = useState<SystemControlItem[]>(() => {
    const saved = localStorage.getItem("super_controls_list");
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_CONTROLS;
  });

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [countdownModalControl, setCountdownModalControl] = useState<SystemControlItem | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState("60");

  const saveControls = (data: SystemControlItem[]) => {
    setControls(data);
    localStorage.setItem("super_controls_list", JSON.stringify(data));
  };

  const handleToggle = (id: string) => {
    const updated = controls.map((c) =>
      c.id === id
        ? {
            ...c,
            isEnabled: !c.isEnabled,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.fullName,
          }
        : c
    );
    saveControls(updated);
  };

  const handleSetCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countdownModalControl) return;

    const mins = parseInt(countdownMinutes) || 60;
    const end = new Date(Date.now() + mins * 60 * 1000).toISOString();

    const updated = controls.map((c) =>
      c.id === countdownModalControl.id
        ? {
            ...c,
            isEnabled: false,
            scheduledCountdownEnd: end,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.fullName,
          }
        : c
    );
    saveControls(updated);
    setCountdownModalControl(null);
  };

  const filtered = controls.filter((c) => {
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q)
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
            <SlidersHorizontal size={24} className="text-purple-600" />
            20 Platform Master Super Controls
          </h1>
          <p className="text-xs text-muted mt-1">
            Emergency freeze switches, continental / city governance, booking kill-switches, and module availability controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted">
            {controls.filter((c) => c.isEnabled).length} / {controls.length} Safe
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-border-color bg-surface">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search controls, keywords, scope..."
            className="w-full bg-surface-elevated border border-border-color rounded-xl pl-8 pr-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
        >
          <option value="all">All Categories (20)</option>
          <option value="emergency">Emergency &amp; Platform Freeze</option>
          <option value="regional">Regional &amp; Continent Gates</option>
          <option value="booking">Booking &amp; Tourism Aggregators</option>
          <option value="modules">Module Feeds (Rental, HR, Procurement)</option>
          <option value="security">Security &amp; Session Eviction</option>
        </select>
      </div>

      {/* Controls List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ctrl) => {
          const isCountdown =
            ctrl.scheduledCountdownEnd &&
            new Date(ctrl.scheduledCountdownEnd) > new Date();

          return (
            <div
              key={ctrl.id}
              className={`p-5 rounded-2xl border transition space-y-4 shadow-xs ${
                ctrl.isEnabled
                  ? "border-border-color bg-surface"
                  : "border-red-500/40 bg-red-500/5 dark:bg-red-950/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ctrl.category === "emergency"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : ctrl.category === "regional"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : ctrl.category === "booking"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {ctrl.category}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{ctrl.key}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{ctrl.title}</h3>
                </div>

                {/* Main Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(ctrl.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    ctrl.isEnabled ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      ctrl.isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-muted leading-relaxed">{ctrl.description}</p>

              {/* Status & Regional Scope */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-color text-[11px]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-muted" />
                  <span className="text-muted">Scope:</span>
                  <strong className="text-foreground capitalize">{ctrl.scope}</strong>
                  {ctrl.targetRegion && (
                    <span className="text-muted font-normal">({ctrl.targetRegion})</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCountdownModalControl(ctrl)}
                    className="flex items-center gap-1 text-muted hover:text-foreground font-medium"
                    title="Set countdown freeze"
                  >
                    <Clock size={11} />
                    <span>Timer</span>
                  </button>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      ctrl.isEnabled ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {ctrl.isEnabled ? (
                      <>
                        <CheckCircle2 size={12} /> Active / Allowed
                      </>
                    ) : (
                      <>
                        <XCircle size={12} /> Frozen / Disabled
                      </>
                    )}
                  </span>
                </div>
              </div>

              {isCountdown && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-[10px] flex items-center justify-between">
                  <span>
                    Countdown Active: Automatically releases at{" "}
                    <strong>{new Date(ctrl.scheduledCountdownEnd!).toLocaleTimeString()}</strong>
                  </span>
                  <button
                    onClick={() => {
                      const updated = controls.map((c) =>
                        c.id === ctrl.id ? { ...c, scheduledCountdownEnd: null } : c
                      );
                      saveControls(updated);
                    }}
                    className="underline font-bold"
                  >
                    Cancel Timer
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Countdown Timer Modal */}
      {countdownModalControl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-foreground">
              Schedule Timed Freeze: {countdownModalControl.title}
            </h3>
            <form onSubmit={handleSetCountdown} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Freeze Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="10080"
                  value={countdownMinutes}
                  onChange={(e) => setCountdownMinutes(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-foreground outline-none focus:border-purple-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setCountdownModalControl(null)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Apply Timed Freeze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
