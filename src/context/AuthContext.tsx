
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { signInWithEmail, signOut, fetchUserProfile } from "@/utils/authUtils";
import { useUserProfile } from "@/hooks/useUserProfile";

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
  const { updateUserProfile: updateProfile } = useUserProfile();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First attach the listener to catch any auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change detected:", event);
        
        if (session?.user) {
          console.log("Session user found in auth change:", session.user.email);
          
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profile => {
              if (profile) setUser(profile);
              setIsLoading(false);
            });
          }, 0);
        } else {
          console.log("No session user in auth change, setting user to null");
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session found" : "No session");
        
        if (session?.user) {
          console.log("Session user found on initial check:", session.user.email);
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profile => {
              if (profile) setUser(profile);
              setIsLoading(false);
            });
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

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    await updateProfile(user.id, data);
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: signInWithEmail,
        signOut,
        isAuthenticated: !!user,
        updateUserProfile: handleUpdateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

