
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change detected:", event);
      if (session?.user) {
        console.log("Session user found:", session.user.email);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          }

          if (profile) {
            console.log("Profile found:", profile);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || session.user.email!,
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
          console.error("Error in auth state change handler:", err);
        }
      } else {
        console.log("No session user, setting user to null");
        setUser(null);
      }
      setIsLoading(false);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    console.log("Signing in with email:", email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful");
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Sign out successful");
    } catch (error) {
      console.error("Sign out failed", error);
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
