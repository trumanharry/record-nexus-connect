
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

interface RoleDisplayProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
}

const RoleDisplay: React.FC<RoleDisplayProps> = ({ role, size = "md" }) => {
  const getColorByRole = () => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case UserRole.DISTRIBUTOR:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case UserRole.CORPORATE:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-sm px-3 py-1";
      default:
        return "text-xs px-2.5 py-0.5";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${getColorByRole()} ${getSizeClasses()} font-medium capitalize rounded-full`}
    >
      {role.toString()}
    </Badge>
  );
};

export default RoleDisplay;
