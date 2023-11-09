import { StorageClient } from '@supabase/storage-js';

export default new StorageClient(process.env.SUPABASE_URL ?? '', {
  apikey: process.env.SERVICE_KEY ?? '',
  Authorization: `Bearer ${process.env.SERVICE_KEY}`,
});
