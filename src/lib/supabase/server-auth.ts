import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { User } from "@supabase/supabase-js";

export const getCachedUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error fetching server user:", error);
    return null;
  }
});
