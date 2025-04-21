
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Get initial session first to prevent flickering
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session found" : "No session");
        
        if (session?.user) {
          console.log("Session user found on initial check:", session.user.email);
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          console.log("No session user on initial check, setting user to null");
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Then set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change detected:", event);
        
        if (session?.user) {
          console.log("Session user found in auth change:", session.user.email);
          
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          console.log("No session user in auth change, setting user to null");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        console.log("Profile found:", profile);
        
        // Ensure the role is properly normalized
        let userRole: UserRole;
        
        if (profile.role) {
          // Convert role string to enum value, with case-insensitive matching
          const normalizedRole = String(profile.role).toLowerCase();
          
          if (normalizedRole === String(UserRole.ADMINISTRATOR).toLowerCase()) {
            userRole = UserRole.ADMINISTRATOR;
          } else if (normalizedRole === String(UserRole.DISTRIBUTOR).toLowerCase()) {
            userRole = UserRole.DISTRIBUTOR;
          } else if (normalizedRole === String(UserRole.CORPORATE).toLowerCase()) {
            userRole = UserRole.CORPORATE;
          } else {
            console.warn(`Unknown role: ${profile.role}, defaulting to CORPORATE`);
            userRole = UserRole.CORPORATE;
          }
        } else {
          console.warn("No role found in profile, defaulting to CORPORATE");
          userRole = UserRole.CORPORATE;
        }
        
        setUser({
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
        });
      } else {
        console.log("No profile found for user");
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple sign in function
  const signIn = async (email: string, password: string) => {
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

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          role: data.role,
          following: data.following,
          updated_at: new Date().toISOString(),
          last_modified_by: user.id,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!user,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
