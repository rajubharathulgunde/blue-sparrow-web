import { createClient } from '@supabase/supabase-js';

// You will get these two URL/Keys from your Supabase Dashboard 
// under Settings -> API. 
// (For security, these should ideally go in a .env file later)
const supabaseUrl = 'https://mycwifdrihcgculztimj.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Y3dpZmRyaWhjZ2N1bHp0aW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjEwODYsImV4cCI6MjEwMzk5NzA4Nn0.Ogt_BgrEY-3k_-0uIZBPUoldqeAVBe2KCUW4MqnZ7Rk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);