
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RecordDetail from "@/components/records/RecordDetail";
import CommentSection from "@/components/common/CommentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityType, Company, Comment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Check if the user is following this record
  const isFollowing = user?.following?.includes(id || "") || false;

  // Fetch company data
  const { 
    data: company, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) throw new Error("Company ID is required");
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Company not found");
      
      // Convert string dates to Date objects
      return {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      } as Company;
    },
    enabled: !!id
  });

  // Fetch comments for this company
  const { 
    data: comments = [],
    isLoading: isLoadingComments 
  } = useQuery({
    queryKey: ["comments", "company", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("record_id", id)
        .eq("record_type", EntityType.COMPANY)
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

  const handleEditCompany = () => {
    // For now, just navigate to a hypothetical edit page
    // In a real app, this would open a modal or navigate to an edit page
    navigate(`/companies/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">
          {error ? (error as Error).message : "Company not found"}
        </p>
      </div>
    );
  }

  return (
    <RecordDetail
      record={company}
      entityType={EntityType.COMPANY}
      title={company.name}
      onEdit={handleEditCompany}
      isFollowing={isFollowing}
    >
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.description && (
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-gray-700">{company.description}</p>
            </div>
          )}
          
          {company.industry && (
            <div>
              <h3 className="font-medium mb-1">Industry</h3>
              <p className="text-gray-700">{company.industry}</p>
            </div>
          )}
          
          {company.website && (
            <div>
              <h3 className="font-medium mb-1">Website</h3>
              <a 
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection 
        recordId={id || ""}
        recordType={EntityType.COMPANY}
        comments={comments}
      />
    </RecordDetail>
  );
};

export default CompanyDetail;
