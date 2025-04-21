
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RecordDetail from "@/components/records/RecordDetail";
import CommentSection from "@/components/common/CommentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityType, Physician, Comment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const PhysicianDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if the user is following this record
  const isFollowing = user?.following?.includes(id || "") || false;

  // Fetch physician data
  const { 
    data: physician, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["physician", id],
    queryFn: async () => {
      if (!id) throw new Error("Physician ID is required");
      
      const { data, error } = await supabase
        .from("physicians")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Physician not found");
      
      // Convert string dates to Date objects
      return {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      } as Physician;
    },
    enabled: !!id
  });

  // Fetch comments for this physician
  const { 
    data: comments = []
  } = useQuery({
    queryKey: ["comments", "physician", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("record_id", id)
        .eq("record_type", EntityType.PHYSICIAN)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(comment => ({
        ...comment,
        id: comment.id,
        content: comment.content,
        recordId: comment.record_id,
        recordType: comment.record_type,
        parentId: comment.parent_id,
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
        createdBy: comment.created_by,
        lastModifiedBy: comment.last_modified_by,
        upvotes: comment.upvotes || [],
        downvotes: comment.downvotes || [],
        score: comment.score || 0
      })) as Comment[];
    },
    enabled: !!id
  });

  const handleEditPhysician = () => {
    navigate(`/physicians/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !physician) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">
          {error ? (error as Error).message : "Physician not found"}
        </p>
      </div>
    );
  }

  return (
    <RecordDetail
      record={physician}
      entityType={EntityType.PHYSICIAN}
      title={`Dr. ${physician.firstName} ${physician.lastName}`}
      onEdit={handleEditPhysician}
      isFollowing={isFollowing}
    >
      {/* Physician Information */}
      <Card>
        <CardHeader>
          <CardTitle>Physician Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {physician.specialty && (
            <div>
              <h3 className="font-medium mb-1">Specialty</h3>
              <p className="text-gray-700">{physician.specialty}</p>
            </div>
          )}
          
          {physician.hospitalAffiliation && (
            <div>
              <h3 className="font-medium mb-1">Hospital Affiliation</h3>
              <p className="text-gray-700">{physician.hospitalAffiliation}</p>
            </div>
          )}
          
          {physician.email && (
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <a 
                href={`mailto:${physician.email}`}
                className="text-blue-600 hover:underline"
              >
                {physician.email}
              </a>
            </div>
          )}
          
          {physician.phone && (
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <a 
                href={`tel:${physician.phone}`}
                className="text-blue-600 hover:underline"
              >
                {physician.phone}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection 
        recordId={id || ""}
        recordType={EntityType.PHYSICIAN}
        comments={comments}
      />
    </RecordDetail>
  );
};

export default PhysicianDetail;
