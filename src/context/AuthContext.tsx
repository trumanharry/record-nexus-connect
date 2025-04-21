
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Sample user data - in a real app this would come from API/backend
const sampleUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: UserRole.ADMINISTRATOR,
    points: 500,
    following: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    lastModifiedBy: "system",
  },
  {
    id: "2",
    email: "distributor@example.com",
    name: "Distributor User",
    role: UserRole.DISTRIBUTOR,
    points: 350,
    following: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    lastModifiedBy: "system",
  },
  {
    id: "3",
    email: "corporate@example.com",
    name: "Corporate User",
    role: UserRole.CORPORATE,
    points: 200,
    following: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    lastModifiedBy: "system",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating auth flow with sample users
      const foundUser = sampleUsers.find((u) => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // In a real app, you'd verify the password here
      // For this demo, any password works
      
      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
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
