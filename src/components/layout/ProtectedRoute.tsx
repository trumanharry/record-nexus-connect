
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
    // Use replace instead of push to avoid building up a history stack
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access with proper error handling
  if (allowedRoles && allowedRoles.length > 0 && user) {
    try {
      console.log("Checking user role:", user.role, "against allowed roles:", allowedRoles);
      
      // Ensure we have a valid user role before checking
      if (!user.role) {
        console.error("User role is undefined");
        toast({
          title: "Authentication Error",
          description: "Your user role could not be determined. Please try logging in again.",
          variant: "destructive",
        });
        return <Navigate to="/login" replace />;
      }
      
      // Check if user role is in the allowed roles
      // Convert both to strings for comparison to avoid type mismatches
      const hasAccess = allowedRoles.some(role => 
        String(role).toLowerCase() === String(user.role).toLowerCase()
      );
      
      console.log("User has access:", hasAccess);
      
      if (!hasAccess) {
        console.log(`User with role ${user.role} attempted to access a route restricted to: ${allowedRoles.join(', ')}`);
        
        toast({
          title: "Access Denied",
          description: `You don't have permission to access this page. Required role: ${allowedRoles.join(', ')}`,
          variant: "destructive",
        });
        
        return <Navigate to="/unauthorized" replace />;
      }
    } catch (error) {
      // Handle any unexpected errors during role checking
      console.error("Error checking user role:", error);
      toast({
        title: "Error",
        description: "An error occurred while checking permissions. Please try again.",
        variant: "destructive",
      });
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
