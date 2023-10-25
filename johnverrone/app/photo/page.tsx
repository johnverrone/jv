import { Metadata } from 'next';
import supabase from '../../lib/supabase';
import PhotoPage from './photo-page';
import { cache } from 'react';

export const revalidate = 3600; // revalidate the data at most every hour

async function getAllImages() {
  const { data, error } = await supabase.storage
    .from('portfolio')
    .list(undefined, {
      sortBy: { column: 'name', order: 'desc' },
    });

  if (error) {
    throw new Error('failed to fetch images from supabase');
  }

  return (
    data?.map((image) => {
      const { data: imageUrl } = supabase.storage
        .from('portfolio')
        .getPublicUrl(image.name);
      return imageUrl.publicUrl;
    }) ?? []
  );
}

const cachedGetAllImages = cache(getAllImages);

export const metadata: Metadata = {
  title: 'photo',
};

export default async function Page() {
  const images = await cachedGetAllImages();
  return <PhotoPage images={images} />;
}
