import Image from 'next/image';
import React from 'react';
import supabase from '../../../../lib/supabase';
import { cache } from 'react';

export const revalidate = 600; // revalidate the data every 10 minutes

async function getImages(dir: string) {
  const { data, error } = await supabase.from('johnandmolly').list(dir, {
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(error.message);
    throw new Error('failed to fetch images from supabase');
  }

  return (
    data?.map((image) => {
      const { data } = supabase
        .from('johnandmolly')
        .getPublicUrl(`${dir}/${image.name}`);
      return data.publicUrl;
    }) ?? []
  );
}

const cachedGetAllImages = cache(getImages);

export async function PhotoGrid({ dir }: { dir: string }) {
  const images = await cachedGetAllImages(dir);

  return (
    <ul className="grid grid-cols-3 gap-3 full-bleed px-3">
      {images.map((image) =>
        image.endsWith('.jpg') ? (
          <li key={image}>
            <a href={image} target="_blank">
              <Image
                src={image}
                alt="some alt text"
                width={640}
                height={800}
                style={{
                  height: 'auto',
                  objectFit: 'cover',
                  aspectRatio: '4/5',
                }}
              />
            </a>
          </li>
        ) : null
      )}
    </ul>
  );
}
