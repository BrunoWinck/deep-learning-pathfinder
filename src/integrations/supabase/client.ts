// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tdfhskxikyxqgchumnrf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZmhza3hpa3l4cWdjaHVtbnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTQ3MjMsImV4cCI6MjA1NTc5MDcyM30.u-efFkG2YtfX8PpSQEGhjY59lGMA2l6y7Vc3lbfWE88";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);