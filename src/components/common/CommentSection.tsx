
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Comment, EntityType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigUp, ArrowBigDown, Reply } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  depth = 0 
}) => {
  const { user } = useAuth();
  const hasVotedUp = user && comment.upvotes.includes(user.id);
  const hasVotedDown = user && comment.downvotes.includes(user.id);
  const maxDepth = 4;

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
              >
                <ArrowBigUp className="h-4 w-4" />
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
              >
                <ArrowBigDown className="h-4 w-4" />
              </Button>
            </div>
            
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6"
                onClick={() => onReply(comment.id)}
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
        <div className={cn("mt-2", depth < maxDepth && "comment-thread")}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              replies={[]} // Not rendering nested replies for simplicity
              depth={depth + 1}
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
  
  // Process comments into a hierarchical structure
  const rootComments = comments.filter(comment => !comment.parentId);
  const commentReplies = (parentId: string) => 
    comments.filter(comment => comment.parentId === parentId);
  
  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };
  
  const handleVote = (commentId: string, direction: "up" | "down") => {
    // In a real app, this would call an API to update votes
    console.log(`Voted ${direction} on comment ${commentId}`);
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return;
    
    // In a real app, this would call an API to save the comment
    console.log("New comment:", {
      content: newComment,
      recordId,
      recordType,
      parentId: replyTo
    });
    
    // Reset form
    setNewComment("");
    setReplyTo(null);
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
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment}>
            {replyTo ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        {rootComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onVote={handleVote}
            replies={commentReplies(comment.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
