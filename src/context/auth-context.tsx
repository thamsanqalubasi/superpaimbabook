import React, { createContext, useContext, useState, useEffect } from "react";
import { SuperAdminUser, SuperPermissionKey } from "../types";
import { INITIAL_ADMINS } from "../data/mock-data";

interface AuthContextType {
  currentUser: SuperAdminUser;
  switchUser: (adminId: string) => void;
  hasPermission: (perm: SuperPermissionKey) => boolean;
  logout: () => void;
  allAdmins: SuperAdminUser[];
  addAdmin: (admin: SuperAdminUser) => void;
  updateAdmin: (id: string, updates: Partial<SuperAdminUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admins, setAdmins] = useState<SuperAdminUser[]>(() => {
    const saved = localStorage.getItem("super_admins_list");
    return saved ? JSON.parse(saved) : INITIAL_ADMINS;
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    return localStorage.getItem("super_current_admin_id") || "sa-001";
  });

  useEffect(() => {
    localStorage.setItem("super_admins_list", JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem("super_current_admin_id", currentId);
  }, [currentId]);

  const currentUser = admins.find((a) => a.id === currentId) || admins[0];

  const hasPermission = (perm: SuperPermissionKey): boolean => {
    if (currentUser.role === "super_user" || currentUser.isFullAccess) return true;
    return currentUser.permissions.includes(perm);
  };

  const switchUser = (adminId: string) => {
    const found = admins.find((a) => a.id === adminId);
    if (found) setCurrentId(found.id);
  };

  const logout = () => {
    setCurrentId(admins[0].id);
  };

  const addAdmin = (newAdmin: SuperAdminUser) => {
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  const updateAdmin = (id: string, updates: Partial<SuperAdminUser>) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        hasPermission,
        logout,
        allAdmins: admins,
        addAdmin,
        updateAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSuperAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useSuperAuth must be used within AuthProvider");
  return context;
}
