
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/common/StarRating";
import { EntityType, Record } from "@/types";
import { Eye, Edit, Trash } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface RecordTableProps<T extends Record> {
  data: T[];
  columns: Column<T>[];
  entityType: EntityType;
  isLoading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
}

function RecordTable<T extends Record>({
  data,
  columns,
  entityType,
  isLoading = false,
  onEdit,
  onDelete,
}: RecordTableProps<T>) {
  const navigate = useNavigate();

  const handleView = (record: T) => {
    navigate(`/${entityType.toLowerCase()}s/${record.id}`);
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }

    const value = item[column.accessor as keyof T];
    
    if (column.accessor === "rating" && typeof value === "number") {
      return <StarRating rating={value} />;
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return value as React.ReactNode;
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No records found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column, index) => (
                <TableCell key={index} className={column.className}>
                  {renderCellContent(item, column)}
                </TableCell>
              ))}
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleView(item)}
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RecordTable;
