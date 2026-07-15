import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getCachedUser = cache(async () => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error fetching server user:", error);
    return null;
  }
});
