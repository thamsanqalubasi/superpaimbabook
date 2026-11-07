import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { SuperLayout } from "./components/super-layout";
import { OverviewPage } from "./pages/overview";
import { CompaniesPage } from "./pages/companies";
import { ControlsPage } from "./pages/controls";
import { AffiliatesPage } from "./pages/affiliates";
import { InquiriesPage } from "./pages/inquiries";
import { FinancesPage } from "./pages/finances";
import { AdminsPage } from "./pages/admins";
import { AuditPage } from "./pages/audit";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SuperLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/controls" element={<ControlsPage />} />
            <Route path="/affiliates" element={<AffiliatesPage />} />
            <Route path="/inquiries" element={<InquiriesPage />} />
            <Route path="/finances" element={<FinancesPage />} />
            <Route path="/admins" element={<AdminsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SuperLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
