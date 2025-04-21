
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Record, EntityType } from "@/types";
import StarRating from "@/components/common/StarRating";
import FollowButton from "@/components/common/FollowButton";
import { ArrowLeft, Edit } from "lucide-react";

interface RecordDetailProps<T extends Record> {
  record: T;
  entityType: EntityType;
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  isFollowing: boolean;
}

function RecordDetail<T extends Record>({
  record,
  entityType,
  title,
  children,
  onEdit,
  isFollowing,
}: RecordDetailProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/${entityType.toLowerCase()}s`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {entityType}s
            </Button>
          </Link>
        </div>
        <div className="flex space-x-2">
          <FollowButton recordId={record.id} initialFollowed={isFollowing} />
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        {"rating" in record && typeof record.rating === "number" && (
          <StarRating rating={record.rating} size="lg" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {children}
          
          {/* Comments section would go here */}
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{record.createdAt.toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd>{record.updatedAt.toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created By</dt>
                  <dd>{record.createdBy}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Modified By</dt>
                  <dd>{record.lastModifiedBy}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked Records</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Linked records would go here */}
              <p className="text-muted-foreground text-sm">
                No linked records yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RecordDetail;
