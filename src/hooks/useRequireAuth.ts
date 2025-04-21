
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
    // Skip checks while loading to avoid premature redirects
    if (isLoading) {
      console.log("useRequireAuth: Still loading auth state, waiting...");
      return;
    }

    console.log("useRequireAuth check:", { 
      isAuthenticated, 
      user: user ? `${user.email} (${user.role})` : 'null',
      allowedRoles: allowedRoles ? allowedRoles.join(", ") : "none"
    });

    // Handle authentication
    if (!isAuthenticated) {
      console.log("useRequireAuth: User not authenticated, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
      return;
    }

    // Skip role check if no roles specified
    if (!allowedRoles || allowedRoles.length === 0) {
      console.log("useRequireAuth: No role restrictions, allowing access");
      return;
    }

    // Handle role-based access
    if (user && user.role) {
      const userRoleString = String(user.role).toLowerCase();
      const hasAccess = allowedRoles.some(role => 
        String(role).toLowerCase() === userRoleString
      );

      console.log(`useRequireAuth: Role check - User role: ${user.role}, Allowed roles: ${allowedRoles.join(", ")}, Has access: ${hasAccess}`);

      if (!hasAccess) {
        console.log(`useRequireAuth: Access denied for role ${user.role}`);
        navigate("/unauthorized", { replace: true });
      }
    } else {
      console.error("useRequireAuth: User role is undefined");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, allowedRoles, user]);

  return { user, isLoading };
};
