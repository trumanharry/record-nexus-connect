
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check for role-based access
  if (allowedRoles && allowedRoles.length > 0 && user) {
    console.log("Checking user role:", user.role, "against allowed roles:", allowedRoles);
    console.log("User role type:", typeof user.role);
    console.log("Allowed roles types:", allowedRoles.map(role => typeof role));
    
    // Check if user role is in the allowed roles
    const hasAccess = allowedRoles.includes(user.role);
    console.log("User has access:", hasAccess);
    
    if (!hasAccess) {
      console.log(`User with role ${user.role} attempted to access a route restricted to: ${allowedRoles.join(', ')}`);
      
      // Show a toast notification about the access restriction
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page. Required role: ${allowedRoles.join(', ')}`,
        variant: "destructive",
      });
      
      return <Navigate to="/unauthorized" />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
