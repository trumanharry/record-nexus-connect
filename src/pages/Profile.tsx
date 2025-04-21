
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import RoleDisplay from "@/components/auth/RoleDisplay";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

const Profile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(user?.name || "");

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ name })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                  {name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-lg">{name || user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="mt-1">
                    <RoleDisplay role={user.role} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div>
                  <RoleDisplay role={user.role} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your role determines what features you can access in the system
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Points</Label>
                <div className="font-semibold text-lg">{user.points || 0} points</div>
                <p className="text-sm text-muted-foreground">
                  Earn points by contributing to the system
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating || name === user.name}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
