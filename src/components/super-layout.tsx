import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  Building2,
  SlidersHorizontal,
  Compass,
  MessageSquare,
  Users,
  DollarSign,
  ScrollText,
  Globe2,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  Lock,
  Layers,
  BarChart3,
} from "lucide-react";
import { useSuperAuth } from "../context/auth-context";

export function SuperLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { currentUser, allAdmins, switchUser } = useSuperAuth();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("super_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("super_theme", "dark");
      setIsDark(true);
    }
  };

  const navItems = [
    {
      to: "/",
      label: "Master Overview",
      icon: Layers,
    },
    {
      to: "/companies",
      label: "Hospitality & Companies",
      icon: Building2,
    },
    {
      to: "/controls",
      label: "Super Controls (20)",
      icon: SlidersHorizontal,
      badge: "Active",
    },
    {
      to: "/affiliates",
      label: "Affiliates & Booking.com",
      icon: Compass,
    },
    {
      to: "/analytics",
      label: "Traffic & Clicks Analytics",
      icon: BarChart3,
      badge: "Live",
    },
    {
      to: "/inquiries",
      label: "Cross-Company Inquiries",
      icon: MessageSquare,
    },
    {
      to: "/finances",
      label: "Finances & Commissions",
      icon: DollarSign,
    },
    {
      to: "/admins",
      label: "Admin Management",
      icon: Users,
    },
    {
      to: "/audit",
      label: "Master Audit Trail",
      icon: ScrollText,
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-color bg-surface flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 border-b border-border-color px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/iconlogo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-xs" />
            <div>
              <span className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                PAIMBABOOK
                <span className="text-[10px] bg-red-600/10 text-red-600 font-extrabold px-1.5 py-0.5 rounded border border-red-500/20">
                  SUPER
                </span>
              </span>
              <p className="text-[10px] text-muted">Platform Master Control</p>
            </div>
          </div>
        </div>

        {/* Impersonation & Security Banner */}
        <div className="m-3 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Lock size={12} className="text-amber-600" />
            Stealth Isolation Active
          </div>
          <p className="text-[10px] opacity-85 leading-relaxed">
            Actions in client companies are kept out of client logs and saved strictly to Super Audit.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-muted hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Main Portal Direct Access */}
        <div className="p-3 border-t border-border-color">
          <a
            href="https://paimbabook.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl border border-border-color bg-surface-elevated hover:bg-surface text-xs font-medium text-muted hover:text-foreground transition group"
          >
            <div className="flex items-center gap-2">
              <Globe2 size={14} className="text-purple-600" />
              <span>Public Portal</span>
            </div>
            <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
          </a>
        </div>

        {/* Admin Profile & Role Switcher */}
        <div className="p-3 border-t border-border-color bg-surface-elevated/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Active Admin
            </span>
            <select
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="text-[11px] font-semibold bg-surface border border-border-color rounded-lg px-2 py-0.5 outline-none text-foreground"
            >
              {allAdmins.map((adm) => (
                <option key={adm.id} value={adm.id}>
                  {adm.fullName} ({adm.role.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-foreground">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-muted truncate">
                  {currentUser.role.replace("_", " ").toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-border-color text-muted hover:text-foreground bg-surface"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border-color bg-surface px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Paimbabook Global Root</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-foreground capitalize">
              {location.pathname.replace("/", "") || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Root Services Connected
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
