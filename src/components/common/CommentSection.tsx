
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Comment, EntityType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigUp, ArrowBigDown, Reply, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, voteOnComment } from "@/services/commentService";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  recordId: string;
  recordType: EntityType;
  comments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onVote: (commentId: string, direction: "up" | "down") => void;
  replies: Comment[];
  depth?: number;
  isVoting: boolean;
  votingCommentId: string | null;
}

// Format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay < 30) return `${diffDay} days ago`;
  
  return date.toLocaleDateString();
};

// Component for a single comment
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  onVote, 
  replies,
  depth = 0,
  isVoting,
  votingCommentId
}) => {
  const { user } = useAuth();
  const hasVotedUp = user && comment.upvotes.includes(user.id);
  const hasVotedDown = user && comment.downvotes.includes(user.id);
  const maxDepth = 4;
  const isProcessingVote = isVoting && votingCommentId === comment.id;

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        {/* User avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-brand-100 text-brand-700">
            {comment.createdBy.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          {/* Comment header */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.createdBy}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          
          {/* Comment body */}
          <p className="text-sm my-1">{comment.content}</p>
          
          {/* Comment actions */}
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-1 h-6",
                  hasVotedUp && "text-brand-600"
                )}
                onClick={() => onVote(comment.id, "up")}
                disabled={isVoting}
              >
                {isProcessingVote ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ArrowBigUp className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs font-medium">{comment.score}</span>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-1 h-6",
                  hasVotedDown && "text-destructive"
                )}
                onClick={() => onVote(comment.id, "down")}
                disabled={isVoting}
              >
                {isProcessingVote ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ArrowBigDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6"
                onClick={() => onReply(comment.id)}
                disabled={isVoting}
              >
                <Reply className="h-3 w-3 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {replies.length > 0 && (
        <div className={cn("mt-2 pl-8", depth < maxDepth && "border-l border-gray-200 ml-4")}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              replies={[]} // Not rendering nested replies for simplicity
              depth={depth + 1}
              isVoting={isVoting}
              votingCommentId={votingCommentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ 
  recordId, 
  recordType, 
  comments 
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Process comments into a hierarchical structure
  const rootComments = comments.filter(comment => !comment.parentId);
  const commentReplies = (parentId: string) => 
    comments.filter(comment => comment.parentId === parentId);
  
  // Handle comment submission
  const addCommentMutation = useMutation({
    mutationFn: (variables: { content: string; parentId?: string }) => 
      addComment(variables.content, recordId, recordType, variables.parentId),
    onSuccess: () => {
      // Clear the form
      setNewComment("");
      setReplyTo(null);
      
      // Refresh comments
      queryClient.invalidateQueries({
        queryKey: ["comments", recordType.toLowerCase(), recordId]
      });
      
      toast({
        title: "Comment added",
        description: replyTo ? "Your reply has been posted" : "Your comment has been posted",
      });
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add comment",
        variant: "destructive"
      });
    }
  });
  
  // Handle voting on comments
  const voteMutation = useMutation({
    mutationFn: (variables: { commentId: string; direction: "up" | "down" }) => 
      voteOnComment(variables.commentId, variables.direction),
    onSuccess: () => {
      // Refresh comments
      queryClient.invalidateQueries({
        queryKey: ["comments", recordType.toLowerCase(), recordId]
      });
    },
    onError: (error) => {
      console.error("Failed to vote:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to vote on comment",
        variant: "destructive"
      });
    }
  });
  
  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };
  
  const handleVote = (commentId: string, direction: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to vote on comments",
        variant: "destructive"
      });
      return;
    }
    
    voteMutation.mutate({ commentId, direction });
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive"
      });
      return;
    }
    
    addCommentMutation.mutate({ 
      content: newComment,
      parentId: replyTo || undefined
    });
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>
      
      {/* Comment form */}
      <div className="mb-6">
        {replyTo && (
          <div className="bg-secondary px-3 py-2 mb-2 text-sm rounded-md flex justify-between">
            <span>Replying to comment</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0" 
              onClick={() => setReplyTo(null)}
              disabled={addCommentMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        )}
        
        <Textarea
          placeholder="Write a comment..."
          className="resize-none mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={addCommentMutation.isPending}
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmitComment}
            disabled={addCommentMutation.isPending || !newComment.trim()}
          >
            {addCommentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {replyTo ? "Sending Reply..." : "Sending..."}
              </>
            ) : (
              replyTo ? "Reply" : "Comment"
            )}
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onVote={handleVote}
              replies={commentReplies(comment.id)}
              isVoting={voteMutation.isPending}
              votingCommentId={
                voteMutation.variables?.commentId || null
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Be the first to comment</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
