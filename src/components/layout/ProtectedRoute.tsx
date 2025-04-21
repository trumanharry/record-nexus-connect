
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Determine if user has access based on authentication and roles
  useEffect(() => {
    // Skip checks while loading
    if (isLoading) return;

    // If not authenticated, no access
    if (!isAuthenticated) {
      console.log("User not authenticated");
      setHasAccess(false);
      return;
    }

    // If no role restrictions, grant access
    if (!allowedRoles || allowedRoles.length === 0) {
      setHasAccess(true);
      return;
    }

    // Check role-based access
    if (user && user.role) {
      const userRoleString = String(user.role).toLowerCase();
      const hasRole = allowedRoles.some(role => 
        String(role).toLowerCase() === userRoleString
      );
      
      console.log(`User role: ${user.role}, Allowed roles: ${allowedRoles.join(", ")}, Has access: ${hasRole}`);
      
      if (!hasRole) {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access this page. Required role: ${allowedRoles.join(", ")}`,
          variant: "destructive",
        });
      }
      
      setHasAccess(hasRole);
    } else {
      console.error("User role is undefined");
      setHasAccess(false);
    }
  }, [user, isLoading, isAuthenticated, allowedRoles]);

  // Show loading state
  if (isLoading || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role-based access denial
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
