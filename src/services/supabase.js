import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://sxeowlqpxhjmwfycevad.supabase.co";
const supabaseKey = "sb_publishable__mAqs0VqLlGy8iF9JpCdFw_mEpZrYkq";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
