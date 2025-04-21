
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";

interface RecordLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onAddNew?: () => void;
  addButtonLabel?: string;
}

const RecordLayout: React.FC<RecordLayoutProps> = ({
  title,
  description,
  children,
  onAddNew,
  addButtonLabel = "Add New"
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onAddNew && (
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default RecordLayout;
