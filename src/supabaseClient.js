import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zkblcpkztcjtalulhtmv.supabase.co";
const supabaseKey = "sb_publishable_g8QjUiItUN0Dcs9uqGkZsg_oa0BU8yI";

export const supabase = createClient(supabaseUrl, supabaseKey);
