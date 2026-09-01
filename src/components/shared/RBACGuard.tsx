"use client";

import React from "react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { UserRole } from "@/modules/iam/types/auth.types";

interface RBACGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RBACGuard({
  children,
  allowedRoles,
  fallback = null,
}: RBACGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
