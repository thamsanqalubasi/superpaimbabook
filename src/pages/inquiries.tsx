import React, { useState } from "react";
import { MessageSquare, Building2, Mail, Phone, Calendar, Clock, CheckCircle } from "lucide-react";
import { CrossCompanyInquiry } from "../types";
import { INITIAL_INQUIRIES } from "../data/mock-data";

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState<CrossCompanyInquiry[]>(() => {
    const saved = localStorage.getItem("super_inquiries_list");
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<CrossCompanyInquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const companiesList = Array.from(new Set(inquiries.map((i) => i.companyName)));

  const handleStatusChange = (id: string, status: CrossCompanyInquiry["status"]) => {
    const updated = inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    setInquiries(updated);
    localStorage.setItem("super_inquiries_list", JSON.stringify(updated));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    alert(`Reply sent to guest ${selectedInquiry.guestEmail} on behalf of ${selectedInquiry.companyName}`);
    handleStatusChange(selectedInquiry.id, "resolved");
    setReplyText("");
    setSelectedInquiry(null);
  };

  const filtered = inquiries.filter((i) => {
    if (companyFilter !== "all" && i.companyName !== companyFilter) return false;
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <MessageSquare size={24} className="text-red-500" />
          Cross-Company Guest Inquiries
        </h1>
        <p className="text-xs text-muted mt-1">
          Super admins and company managers can view and respond to guest inquiries for all internal and partner companies. Each inquiry clearly denotes the originating company.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-border-color bg-surface">
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
        >
          <option value="all">All Originating Companies</option>
          {companiesList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated border border-border-color rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-purple-600"
        >
          <option value="all">All Inquiry Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((inq) => (
          <div
            key={inq.id}
            className="p-5 rounded-2xl border border-border-color bg-surface shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{inq.guestName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                    <Building2 size={10} />
                    {inq.companyName}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mt-1">{inq.subject}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    inq.status === "open"
                      ? "bg-red-500/10 text-red-600"
                      : inq.status === "in_progress"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {inq.status.replace("_", " ")}
                </span>
                <button
                  onClick={() => setSelectedInquiry(inq)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Reply as {inq.companyName.split(" ")[0]}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed bg-surface-elevated/40 p-3 rounded-xl">
              "{inq.message}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
              <span className="flex items-center gap-1">
                <Mail size={12} /> {inq.guestEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} /> {inq.guestPhone}
              </span>
              {inq.checkInDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Dates: {inq.checkInDate} to {inq.checkOutDate}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface border border-border-color rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-foreground">
              Reply to {selectedInquiry.guestName}
            </h3>
            <p className="text-xs text-muted">
              Replying on behalf of: <strong>{selectedInquiry.companyName}</strong>
            </p>
            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <textarea
                required
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the guest. This email will be branded under the company name..."
                className="w-full bg-surface-elevated border border-border-color rounded-xl p-3 text-foreground outline-none focus:border-purple-600 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl border border-border-color text-muted hover:bg-surface-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Send Official Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
