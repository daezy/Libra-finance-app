import { createClient } from "@supabase/supabase-js";
import { Database } from "./schema";

const supabaseUrl = "https://qnpslhoacqkoyxtiwinh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucHNsaG9hY3Frb3l4dGl3aW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3NTY1OTAsImV4cCI6MjAyNTMzMjU5MH0.iy-HNSyZsAot56ZIuFki2yP_uVvqZyLzmiOlQFVpabA";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function createStake(address: string, lastunstake: string) {
  try {
    const { error } = await supabase
      .from("stakes")
      .insert({
        address,
        lastunstake,
      })
      .single();
    if (error) return error;
    console.log("successful");
  } catch (err) {
    console.log(err);
  }
}

export async function deleteStake(address: string) {
  try {
    const { error } = await supabase
      .from("stakes")
      .delete()
      .eq("address", address);
    if (error) return error;
    console.log("successful");
  } catch (err) {
    console.log(err);
  }
}
