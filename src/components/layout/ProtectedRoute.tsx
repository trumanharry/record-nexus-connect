
import React from "react";
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Handle not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Skip role check if no roles specified
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Check role-based access
  if (user && user.role) {
    const userRoleString = String(user.role).toLowerCase();
    const hasAccess = allowedRoles.some(role => 
      String(role).toLowerCase() === userRoleString
    );
    
    console.log(`User role: ${user.role}, Allowed roles: ${allowedRoles.join(", ")}, Has access: ${hasAccess}`);
    
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page. Required role: ${allowedRoles.join(", ")}`,
        variant: "destructive",
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    console.error("User role is undefined");
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
