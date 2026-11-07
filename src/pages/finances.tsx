import React, { useState } from "react";
import { DollarSign, TrendingUp, Percent, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { INITIAL_COMPANIES, INITIAL_AFFILIATE_PROPERTIES } from "../data/mock-data";

export function FinancesPage() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [affiliates, setAffiliates] = useState(INITIAL_AFFILIATE_PROPERTIES);

  const totalCompanyRevenue = companies.reduce((sum, c) => sum + c.monthlyRevenueEstimate, 0);
  const totalCompanyCommissions = companies.reduce(
    (sum, c) => sum + (c.monthlyRevenueEstimate * c.platformCommissionRate) / 100,
    0
  );
  const totalAffiliateCommissions = affiliates.reduce(
    (sum, a) => sum + a.estimatedEarnings,
    0
  );

  const grandTotal = totalCompanyCommissions + totalAffiliateCommissions;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <DollarSign size={24} className="text-emerald-500" />
          Finances &amp; Platform Commission Ledger
        </h1>
        <p className="text-xs text-muted mt-1">
          Track outbound affiliate link conversions, direct hotel commissions, and monthly platform revenue.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Total Monthly Platform Net</span>
          <div className="text-2xl font-black text-emerald-600">
            R {grandTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted">Direct commissions + Affiliate revenue</p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Hotel Group Commissions</span>
          <div className="text-2xl font-black text-foreground">
            R {totalCompanyCommissions.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted">
            From R {totalCompanyRevenue.toLocaleString()} gross guest bookings
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border-color bg-surface shadow-xs space-y-1">
          <span className="text-xs font-bold text-muted">Affiliate OTA Revenue</span>
          <div className="text-2xl font-black text-foreground">
            R {totalAffiliateCommissions.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted">Booking.com, Expedia link referrals</p>
        </div>
      </div>

      {/* Commission Rate Matrix Table */}
      <div className="p-5 rounded-2xl border border-border-color bg-surface space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Managed Companies Commission Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border-color text-muted font-bold">
                <th className="pb-2">Company / Group</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Est. Monthly GMV</th>
                <th className="pb-2">Commission Rate</th>
                <th className="pb-2 text-right">Earned Platform Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {companies.map((comp) => {
                const fee = (comp.monthlyRevenueEstimate * comp.platformCommissionRate) / 100;
                return (
                  <tr key={comp.id} className="py-2.5">
                    <td className="py-3 font-bold text-foreground">{comp.name}</td>
                    <td className="py-3 capitalize text-muted">
                      {comp.ownershipType.replace("_", " ")}
                    </td>
                    <td className="py-3">R {comp.monthlyRevenueEstimate.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-bold">
                        {comp.platformCommissionRate}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      R {fee.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
