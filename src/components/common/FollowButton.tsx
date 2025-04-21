
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  recordId: string;
  initialFollowed: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ recordId, initialFollowed }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowed);
  const { user } = useAuth();
  
  const handleToggleFollow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow records",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to update follow status
    setIsFollowing(!isFollowing);
    
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? "You will no longer receive updates for this record"
        : "You will receive updates for this record",
    });
  };
  
  return (
    <Button
      variant={isFollowing ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggleFollow}
      className="gap-1"
    >
      <Star
        className={`h-4 w-4 ${isFollowing ? "fill-yellow-400" : ""}`}
      />
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
