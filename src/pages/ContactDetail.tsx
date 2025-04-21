
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RecordDetail from "@/components/records/RecordDetail";
import CommentSection from "@/components/common/CommentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityType, Contact, Comment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if the user is following this record
  const isFollowing = user?.following?.includes(id || "") || false;

  // For now, we'll use mock data since we haven't created the contacts table yet
  const mockContact: Contact = {
    id: id || "mock-id",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    title: "Sales Manager",
    company: "Mock Company",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    lastModifiedBy: "system"
  };

  // Fetch contact data (using mock data for now)
  const { 
    data: contact, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      // Return the mock contact for now
      return mockContact;
    },
    enabled: !!id
  });

  // Fetch comments for this contact
  const { 
    data: comments = []
  } = useQuery({
    queryKey: ["comments", "contact", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("record_id", id)
        .eq("record_type", EntityType.CONTACT)
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

  const handleEditContact = () => {
    navigate(`/contacts/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">
          {error ? (error as Error).message : "Contact not found"}
        </p>
      </div>
    );
  }

  return (
    <RecordDetail
      record={contact}
      entityType={EntityType.CONTACT}
      title={`${contact.firstName} ${contact.lastName}`}
      onEdit={handleEditContact}
      isFollowing={isFollowing}
    >
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.title && (
            <div>
              <h3 className="font-medium mb-1">Title</h3>
              <p className="text-gray-700">{contact.title}</p>
            </div>
          )}
          
          {contact.company && (
            <div>
              <h3 className="font-medium mb-1">Company</h3>
              <p className="text-gray-700">{contact.company}</p>
            </div>
          )}
          
          {contact.email && (
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <a 
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>
          )}
          
          {contact.phone && (
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <a 
                href={`tel:${contact.phone}`}
                className="text-blue-600 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection 
        recordId={id || ""}
        recordType={EntityType.CONTACT}
        comments={comments}
      />
    </RecordDetail>
  );
};

export default ContactDetail;
