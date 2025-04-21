
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change detected:", event);
        
        if (session?.user) {
          console.log("Session user found:", session.user.email);
          fetchUserProfile(session.user.id);
        } else {
          console.log("No session user, setting user to null");
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
        setUser({
          id: userId,
          email: profile.email,
          name: profile.name || profile.email,
          role: profile.role as UserRole,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
