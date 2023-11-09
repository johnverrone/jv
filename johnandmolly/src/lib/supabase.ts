import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wnnjdgkrwtehvvxfqohk.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubmpkZ2tyd3RlaHZ2eGZxb2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyOTMyNjcsImV4cCI6MjAwMTg2OTI2N30.mYeuinmAMz1sGmvYNNP4_RnvEQCXYHzkhtep0HKs15o';

export default createClient(SUPABASE_URL, ANON_KEY);
