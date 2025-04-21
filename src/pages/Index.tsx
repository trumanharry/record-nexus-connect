
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  // Improved handler for redirection
  useEffect(() => {
    // Only redirect after auth state is confirmed and not already redirecting
    if (!isLoading && isAuthenticated && !redirecting) {
      console.log("Index: User is authenticated, redirecting to dashboard");
      setRedirecting(true);
      
      // Small delay to ensure stable redirect
      const redirectTimer = setTimeout(() => {
        navigate("/dashboard");
      }, 50);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isLoading, navigate, redirecting]);

  // Show loading while authentication state is being determined
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-700 mb-6">
            RecordNexus Connect
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The complete solution for contact management and partner selling.
            Connect your records, track relationships, and boost collaboration
            across your organization.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="px-8 py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg"
            onClick={() => navigate("/dashboard")}
          >
            View Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-brand-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Linked Records</h3>
            <p className="text-gray-600">
              Connect different record types with powerful many-to-many
              relationships. See the complete picture of your business network.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-brand-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Threaded Comments</h3>
            <p className="text-gray-600">
              Collaborate with your team through threaded comments and voting.
              Keep important discussions organized and accessible.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-brand-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Points & Rankings</h3>
            <p className="text-gray-600">
              Motivate your team with points for contributing data. Track
              performance and recognize top contributors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
