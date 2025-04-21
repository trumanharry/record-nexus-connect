
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface UseRequireAuthOptions {
  redirectTo?: string;
  allowedRoles?: UserRole[];
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectTo = "/login", allowedRoles } = options;
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // Handle authentication
    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Skip role check if no roles specified
    if (!allowedRoles || allowedRoles.length === 0) return;

    // Handle role-based access
    if (user && user.role) {
      const userRoleString = String(user.role).toLowerCase();
      const hasAccess = allowedRoles.some(role => 
        String(role).toLowerCase() === userRoleString
      );

      if (!hasAccess) {
        console.log(`Access denied: user role ${user.role} not in allowed roles: ${allowedRoles.join(', ')}`);
        navigate("/unauthorized", { replace: true });
      }
    } else {
      console.error("User role is undefined");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, allowedRoles, user]);

  return { user, isLoading };
};
