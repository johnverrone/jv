import Image from 'next/image';
import React from 'react';
import storage from '../../../../lib/storage';
import { cache } from 'react';

export const revalidate = 600; // revalidate the data every 10 minutes

async function getImages(dir: string) {
  const [files] = await storage.bucket('johnandmolly').getFiles({
    prefix: dir,
  });
  return files.map((f) => {
    return `https://storage.googleapis.com/${f.cloudStorageURI.hostname}${f.cloudStorageURI.pathname}`;
  });
}

const cachedGetAllImages = cache(getImages);

export async function PhotoGrid({ dir }: { dir: string }) {
  const images = await cachedGetAllImages(dir);

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,_minmax(max(250px,calc((100%-24px)/3)),_1fr))] gap-3 full-bleed px-3">
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
        ) : null,
      )}
    </ul>
  );
}
