/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function TravelPage() {
  const locations = [
    {
      slug: 'norway',
      name: 'Norway',
      date: 'September 2023',
    },
    {
      slug: 'sweden',
      name: 'Sweden',
      date: 'September 2023',
    },
    {
      slug: 'denmark',
      name: 'Denmark',
      date: 'September 2023',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {locations.map(({ name, date, slug }) => (
        <Link href={`travel/${slug}`} key={slug}>
          <div className="flex h-60">
            <div className="absolute bg-slate-200 rounded-2xl w-60 h-60">
              <img
                src="https://picsum.photos/250"
                width={250}
                height={250}
                alt="photo"
                style={{ borderRadius: 'inherit' }}
              />
            </div>
            <div className="relative flex flex-col justify-end left-[7vw] pb-[3%]">
              <h1 className="text-[6vw] font-bold">{name}</h1>
              <h4 className="text-[max(1.3vw,1rem)] ms-[4vw]">{date}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
