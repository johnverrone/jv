import { Metadata } from 'next';
import supabase from '../../lib/supabase';
import PhotoPage from './photo-page';

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

export const metadata: Metadata = {
  title: 'photo',
};

export default async function Page() {
  const images = await getAllImages();
  return <PhotoPage images={images} />;
}
