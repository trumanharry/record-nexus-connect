
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const signInWithEmail = async (email: string, password: string) => {
  console.log("Signing in with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }
    
    console.log("Sign in successful:", data);
    return data;
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Sign out successful");
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

export const normalizeUserRole = (role?: string): UserRole => {
  if (role) {
    const normalizedRole = String(role).toLowerCase();
    
    if (normalizedRole === String(UserRole.ADMINISTRATOR).toLowerCase()) {
      return UserRole.ADMINISTRATOR;
    } else if (normalizedRole === String(UserRole.DISTRIBUTOR).toLowerCase()) {
      return UserRole.DISTRIBUTOR;
    } else if (normalizedRole === String(UserRole.CORPORATE).toLowerCase()) {
      return UserRole.CORPORATE;
    }
  }
  
  console.warn("No valid role found, defaulting to CORPORATE");
  return UserRole.CORPORATE;
};

export const fetchUserProfile = async (userId: string) => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    if (profile) {
      console.log("Profile found:", profile);
      const userRole = normalizeUserRole(profile.role);
      
      return {
        id: userId,
        email: profile.email,
        name: profile.name || profile.email,
        role: userRole,
        points: profile.points || 0,
        following: profile.following || [],
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        createdBy: profile.created_by,
        lastModifiedBy: profile.last_modified_by,
      };
    }
    
    console.log("No profile found for user");
    return null;
  } catch (err) {
    console.error("Error in fetchUserProfile:", err);
    return null;
  }
};

