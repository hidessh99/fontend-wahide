"use client";

import { useAuth } from "./useAuth";
import {
  isAdmin as checkIsAdmin,
  isSeller as checkIsSeller,
  isCS as checkIsCS,
  isTenantOwner as checkIsTenantOwner,
  canAccessBilling as checkCanAccessBilling,
  canManageTeam as checkCanManageTeam,
  canPairQRDevice as checkCanPairQRDevice,
  canAccessCampaigns as checkCanAccessCampaigns,
} from "../types/auth.types";

export function useHasPermission() {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;

  const isAdmin = checkIsAdmin(role);
  const isSeller = checkIsSeller(role);
  const isCS = checkIsCS(role);
  const isOwner = checkIsTenantOwner(role);

  return {
    role: role || "",
    isAuthenticated,
    isAdmin,
    isSeller,
    isCS,
    isOwner,
    canAccessBilling: checkCanAccessBilling(role),
    canManageTeam: checkCanManageTeam(role),
    canPairQRDevice: checkCanPairQRDevice(role),
    canAccessCampaigns: checkCanAccessCampaigns(role),
  };
}
