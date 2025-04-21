
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
      navigate(redirectTo);
    } else if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      // User is authenticated but doesn't have the required role
      navigate("/unauthorized");
      console.error("User doesn't have the required role to access this page");
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, allowedRoles, user]);

  return { user, isLoading };
};
