
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { UserRole } from "./types";
import CompanyDetail from "./pages/CompanyDetail";
import HospitalDetail from "./pages/HospitalDetail";
import ContactDetail from "./pages/ContactDetail";
import PhysicianDetail from "./pages/PhysicianDetail";
import PointsPage from "./pages/PointsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes that require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Entity list pages */}
                <Route path="/companies" element={<Dashboard />} />
                <Route path="/hospitals" element={<Dashboard />} />
                <Route path="/contacts" element={<Dashboard />} />
                <Route path="/physicians" element={<Dashboard />} />
                
                {/* Entity detail pages */}
                <Route path="/companies/:id" element={<CompanyDetail />} />
                <Route path="/hospitals/:id" element={<HospitalDetail />} />
                <Route path="/contacts/:id" element={<ContactDetail />} />
                <Route path="/physicians/:id" element={<PhysicianDetail />} />
                
                {/* Points/rewards page */}
                <Route path="/points" element={<PointsPage />} />
              </Route>
            </Route>
            
            {/* Administrator only routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]} />}>
              <Route element={<MainLayout />}>
                <Route path="/settings" element={<Dashboard />} />
                <Route path="/import" element={<Dashboard />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
