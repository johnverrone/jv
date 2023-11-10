import Image from 'next/image';
import React from 'react';

export function HeroImage({ name }: { name: string }) {
  return (
    <div className="full-bleed -mt-8">
      <Image
        src={`https://wnnjdgkrwtehvvxfqohk.supabase.co/storage/v1/object/public/johnandmolly/heros/${name}.jpg`}
        alt="some alt text"
        width={1920}
        height={1280}
        style={{
          width: '100%',
          minHeight: 200,
          objectFit: 'cover',
          aspectRatio: '16/4',
        }}
      />
    </div>
  );
}
