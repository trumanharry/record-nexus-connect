import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  Building,
  User,
  FileText,
  BarChart3,
  Settings,
  Upload,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  active,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-3 py-3 mb-1",
        "text-[#E4E4E7] hover:text-white",
        "rounded-md transition-all duration-200",
        active
          ? "bg-brand-700 text-white font-medium"
          : "hover:bg-brand-700/50"
      )}
    >
      <span className="inline-flex shrink-0 mr-3">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log("Current user in sidebar:", user);
  console.log("Current location:", location.pathname);
  
  const isAdmin = user?.role === UserRole.ADMINISTRATOR;
  console.log("Is user admin?", isAdmin, "Role:", user?.role, "AdminRole:", UserRole.ADMINISTRATOR);

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    // We'll let the Link component handle navigation instead
  };

  const navItems = [
    { icon: <BarChart3 size={20} />, label: "Dashboard", to: "/dashboard" },
    { icon: <Building size={20} />, label: "Companies", to: "/companies" },
    { icon: <Building size={20} />, label: "Hospitals", to: "/hospitals" },
    { icon: <User size={20} />, label: "Contacts", to: "/contacts" },
    { icon: <FileText size={20} />, label: "Physicians", to: "/physicians" },
    { icon: <Star size={20} />, label: "Points & Rankings", to: "/points" },
  ];
  
  if (isAdmin) {
    navItems.push(
      { icon: <Upload size={20} />, label: "Import Data", to: "/import" },
      { icon: <Settings size={20} />, label: "Settings", to: "/settings" }
    );
  }

  return (
    <div className="w-64 min-h-screen bg-brand-800 text-white flex flex-col">
      <div className="p-6 flex items-center justify-center border-b border-brand-700">
        <h2 className="text-xl font-bold text-white">
          RecordNexus
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to}
            onClick={() => handleNavigation(item.to)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-brand-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white">
            {user?.name
              ? user.name.split(" ").map((n) => n[0]).join("")
              : user?.email?.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm text-white">{user?.name || user?.email}</p>
            <p className="text-xs text-brand-300 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
