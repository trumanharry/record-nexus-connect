
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

    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true });
    } else if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      user
    ) {
      // Check if user has a role
      if (!user.role) {
        console.error("User role is undefined");
        navigate("/login", { replace: true });
        return;
      }
      
      // Convert both to strings for comparison to avoid type mismatches
      const hasAccess = allowedRoles.some(role => 
        String(role).toLowerCase() === String(user.role).toLowerCase()
      );
      
      if (!hasAccess) {
        // User is authenticated but doesn't have the required role
        console.error(`User with role ${user.role} doesn't have the required role to access this page. Allowed roles: ${allowedRoles.join(", ")}`);
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, allowedRoles, user]);

  return { user, isLoading };
};
