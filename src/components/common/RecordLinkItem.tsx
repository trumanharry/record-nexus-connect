
import React from "react";
import { Link } from "react-router-dom";
import { Building, User, FileText } from "lucide-react";
import { EntityType } from "@/types";
import { cn } from "@/lib/utils";

interface RecordLinkItemProps {
  id: string;
  entityType: EntityType;
  name: string;
  subtitle?: string;
  onRemove?: () => void;
}

const RecordLinkItem: React.FC<RecordLinkItemProps> = ({
  id,
  entityType,
  name,
  subtitle,
  onRemove
}) => {
  const getIcon = () => {
    switch (entityType) {
      case EntityType.COMPANY:
      case EntityType.HOSPITAL:
        return <Building className="h-4 w-4" />;
      case EntityType.CONTACT:
      case EntityType.USER:
      case EntityType.PHYSICIAN:
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getPath = () => {
    switch (entityType) {
      case EntityType.COMPANY:
        return `/companies/${id}`;
      case EntityType.HOSPITAL:
        return `/hospitals/${id}`;
      case EntityType.CONTACT:
        return `/contacts/${id}`;
      case EntityType.PHYSICIAN:
        return `/physicians/${id}`;
      case EntityType.USER:
        return `/users/${id}`;
      default:
        return "#";
    }
  };
  
  const getTypeColor = () => {
    switch (entityType) {
      case EntityType.COMPANY:
        return "bg-blue-100 text-blue-800";
      case EntityType.HOSPITAL:
        return "bg-green-100 text-green-800";
      case EntityType.CONTACT:
        return "bg-purple-100 text-purple-800";
      case EntityType.PHYSICIAN:
        return "bg-amber-100 text-amber-800";
      case EntityType.USER:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-md border border-gray-200 shadow-sm">
      <div className={cn("p-2 rounded-full", getTypeColor())}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <Link to={getPath()} className="font-medium text-sm hover:underline">
          {name}
        </Link>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Remove link"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default RecordLinkItem;
