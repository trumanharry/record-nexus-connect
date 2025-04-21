
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          role: data.role,
          following: data.following,
          updated_at: new Date().toISOString(),
          last_modified_by: userId,
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return { updateUserProfile };
};

