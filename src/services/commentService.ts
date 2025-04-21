import { supabase } from "@/integrations/supabase/client";
import { Comment, EntityType } from "@/types";

export async function addComment(
  content: string,
  recordId: string,
  recordType: EntityType,
  parentId?: string
): Promise<Comment> {
  const user = (await supabase.auth.getSession()).data.session?.user;
  
  if (!user) throw new Error("You must be logged in to comment");
  if (!content.trim()) throw new Error("Comment cannot be empty");
  
  const now = new Date();
  const newComment = {
    content,
    record_id: recordId,
    record_type: recordType,
    parent_id: parentId || null,
    created_by: user.id,
    last_modified_by: user.id,
    upvotes: [],
    downvotes: [],
    score: 0,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
  
  const { data, error } = await supabase
    .from("comments")
    .insert(newComment)
    .select()
    .single();
    
  if (error) throw error;
  
  // Update user points for adding a comment
  await updateUserPoints(user.id, 1, "Add Comment");
  
  return {
    id: data.id,
    content: data.content,
    recordId: data.record_id,
    recordType: data.record_type as EntityType,
    parentId: data.parent_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    createdBy: data.created_by,
    lastModifiedBy: data.last_modified_by,
    upvotes: data.upvotes || [],
    downvotes: data.downvotes || [],
    score: data.score || 0
  };
}

export async function voteOnComment(
  commentId: string,
  direction: "up" | "down"
): Promise<Comment> {
  const user = (await supabase.auth.getSession()).data.session?.user;
  
  if (!user) throw new Error("You must be logged in to vote");
  
  // First get the current comment to check if user has already voted
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .single();
    
  if (fetchError) throw fetchError;
  
  // Initialize arrays if they don't exist
  const upvotes = comment.upvotes || [];
  const downvotes = comment.downvotes || [];
  
  const userId = user.id;
  const hasUpvoted = upvotes.includes(userId);
  const hasDownvoted = downvotes.includes(userId);
  
  let newUpvotes = [...upvotes];
  let newDownvotes = [...downvotes];
  let pointChange = 0;
  
  if (direction === "up") {
    // If already upvoted, remove upvote
    if (hasUpvoted) {
      newUpvotes = newUpvotes.filter(id => id !== userId);
      pointChange = -1;
    } 
    // Otherwise add upvote and remove downvote if exists
    else {
      newUpvotes.push(userId);
      pointChange = 1;
      if (hasDownvoted) {
        newDownvotes = newDownvotes.filter(id => id !== userId);
        pointChange += 1; // +1 for removing downvote
      }
    }
  } else {
    // If already downvoted, remove downvote
    if (hasDownvoted) {
      newDownvotes = newDownvotes.filter(id => id !== userId);
      pointChange = 1;
    } 
    // Otherwise add downvote and remove upvote if exists
    else {
      newDownvotes.push(userId);
      pointChange = -1;
      if (hasUpvoted) {
        newUpvotes = newUpvotes.filter(id => id !== userId);
        pointChange -= 1; // -1 for removing upvote
      }
    }
  }
  
  // Calculate the new score
  const newScore = newUpvotes.length - newDownvotes.length;
  
  // Update the comment
  const { data: updatedComment, error } = await supabase
    .from("comments")
    .update({
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      score: newScore,
      updated_at: new Date().toISOString(),
      last_modified_by: userId
    })
    .eq("id", commentId)
    .select()
    .single();
    
  if (error) throw error;
  
  // If the comment author is getting votes, update their points
  if (comment.created_by !== userId && pointChange !== 0) {
    await updateUserPoints(
      comment.created_by,
      pointChange,
      direction === "up" ? "Upvote Received" : "Downvote Received"
    );
  }
  
  return {
    id: updatedComment.id,
    content: updatedComment.content,
    recordId: updatedComment.record_id,
    recordType: updatedComment.record_type as EntityType,
    parentId: updatedComment.parent_id,
    createdAt: new Date(updatedComment.created_at),
    updatedAt: new Date(updatedComment.updated_at),
    createdBy: updatedComment.created_by,
    lastModifiedBy: updatedComment.last_modified_by,
    upvotes: updatedComment.upvotes || [],
    downvotes: updatedComment.downvotes || [],
    score: updatedComment.score || 0
  };
}

export async function updateUserPoints(
  userId: string,
  points: number,
  reason: string
): Promise<void> {
  // First get the user's current points
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();
    
  if (fetchError) throw fetchError;
  
  const currentPoints = profile.points || 0;
  const newPoints = currentPoints + points;
  
  // Update the user's points
  const { error } = await supabase
    .from("profiles")
    .update({
      points: newPoints,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
    
  if (error) throw error;
  
  // Log the points transaction
  const { error: logError } = await supabase
    .from("point_transactions")
    .insert({
      user_id: userId,
      points: points,
      reason: reason,
      created_at: new Date().toISOString()
    });
    
  if (logError) {
    console.error("Failed to log point transaction:", logError);
  }
}

export async function followRecord(
  recordId: string,
  follow: boolean
): Promise<void> {
  const user = (await supabase.auth.getSession()).data.session?.user;
  
  if (!user) throw new Error("You must be logged in to follow records");
  
  // Get current following list
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("following")
    .eq("id", user.id)
    .single();
    
  if (fetchError) throw fetchError;
  
  // Initialize following array if it doesn't exist
  let following = profile.following || [];
  
  if (follow) {
    // Add record to following if not already there
    if (!following.includes(recordId)) {
      following.push(recordId);
    }
  } else {
    // Remove record from following
    following = following.filter(id => id !== recordId);
  }
  
  // Update user profile
  const { error } = await supabase
    .from("profiles")
    .update({
      following: following,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);
    
  if (error) throw error;
}
