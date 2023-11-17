import { StorageClient } from '@supabase/storage-js';

const client = new StorageClient(process.env.SUPABASE_URL ?? '', {
  apikey: process.env.SERVICE_KEY ?? '',
  Authorization: `Bearer ${process.env.SERVICE_KEY}`,
});

export default client;
