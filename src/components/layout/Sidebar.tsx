
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 py-6 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
        active && "bg-sidebar-accent font-medium"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </Button>
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
    navigate(path);
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
    navItems.push({
      icon: <Upload size={20} />,
      label: "Import Data", 
      to: "/import"
    });
    
    navItems.push({
      icon: <Settings size={20} />,
      label: "Settings",
      to: "/settings",
    });
  }

  return (
    <div className="w-64 bg-sidebar-background text-sidebar-foreground flex flex-col">
      <div className="p-6 flex items-center justify-center">
        <h2 className="text-xl font-bold text-sidebar-primary-foreground">
          RecordNexus
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
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
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
            {user?.name
              ? user.name.split(" ").map((n) => n[0]).join("")
              : user?.email?.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">{user?.name || user?.email}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
