import React, { useState } from "react";
import { ScrollText, Lock, ShieldCheck, Search, Filter } from "lucide-react";
import { SuperAuditLog } from "../types";
import { INITIAL_AUDIT_LOGS } from "../data/mock-data";

export function AuditPage() {
  const [logs] = useState<SuperAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <ScrollText size={24} className="text-blue-500" />
          Master Platform Super Audit Trail
        </h1>
        <p className="text-xs text-muted mt-1">
          Every super admin action, stealth company login, feature toggle, and regional freeze is immutably logged here. Client company audit trails are kept clean and free from platform administration noise.
        </p>
      </div>

      <div className="p-3 rounded-2xl border border-border-color bg-surface">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit logs by admin name, action, or details..."
          className="w-full bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{log.adminName}</span>
                <span className="text-[10px] font-mono bg-surface-elevated border border-border-color px-2 py-0.5 rounded font-bold text-purple-700 dark:text-purple-300">
                  {log.action}
                </span>
                {log.targetCompanyName && (
                  <span className="text-[10px] text-muted">
                    on <strong>{log.targetCompanyName}</strong>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-muted leading-relaxed">{log.details}</p>

            {log.ipAddress && (
              <div className="text-[10px] text-muted font-mono">
                IP: {log.ipAddress} · Stealth Isolation: Verified
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
