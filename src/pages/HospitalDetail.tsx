
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RecordDetail from "@/components/records/RecordDetail";
import CommentSection from "@/components/common/CommentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityType, Hospital, Comment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const HospitalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Check if the user is following this record
  const isFollowing = user?.following?.includes(id || "") || false;

  // Fetch hospital data
  const { 
    data: hospital, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["hospital", id],
    queryFn: async () => {
      if (!id) throw new Error("Hospital ID is required");
      
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Hospital not found");
      
      // Convert string dates to Date objects
      return {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      } as Hospital;
    },
    enabled: !!id
  });

  // Fetch comments for this hospital
  const { 
    data: comments = [],
    isLoading: isLoadingComments 
  } = useQuery({
    queryKey: ["comments", "hospital", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("record_id", id)
        .eq("record_type", EntityType.HOSPITAL)
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

  const handleEditHospital = () => {
    // For now, just navigate to a hypothetical edit page
    navigate(`/hospitals/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">
          {error ? (error as Error).message : "Hospital not found"}
        </p>
      </div>
    );
  }

  return (
    <RecordDetail
      record={hospital}
      entityType={EntityType.HOSPITAL}
      title={hospital.name}
      onEdit={handleEditHospital}
      isFollowing={isFollowing}
    >
      {/* Hospital Information */}
      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hospital.description && (
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-gray-700">{hospital.description}</p>
            </div>
          )}
          
          {hospital.type && (
            <div>
              <h3 className="font-medium mb-1">Type</h3>
              <p className="text-gray-700">{hospital.type}</p>
            </div>
          )}
          
          {hospital.beds !== undefined && (
            <div>
              <h3 className="font-medium mb-1">Number of Beds</h3>
              <p className="text-gray-700">{hospital.beds}</p>
            </div>
          )}
          
          {hospital.address && (
            <div>
              <h3 className="font-medium mb-1">Address</h3>
              <p className="text-gray-700">{hospital.address}</p>
            </div>
          )}
          
          {hospital.website && (
            <div>
              <h3 className="font-medium mb-1">Website</h3>
              <a 
                href={hospital.website.startsWith("http") ? hospital.website : `https://${hospital.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {hospital.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection 
        recordId={id || ""}
        recordType={EntityType.HOSPITAL}
        comments={comments}
      />
    </RecordDetail>
  );
};

export default HospitalDetail;
