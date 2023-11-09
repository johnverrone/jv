/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function TravelPage() {
  const locations = [
    {
      slug: 'bergen',
      name: 'Bergen',
      date: 'September 2023',
      img: 's/bergen.jpg',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {locations.map(({ date, img, name, slug }) => (
        <Link href={`travel/${slug}`} key={slug}>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className=" bg-slate-200 rounded-2xl w-60 h-60">
              <img
                src={img}
                width={250}
                height={250}
                alt="photo"
                style={{ borderRadius: 'inherit' }}
              />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-[max(6vw,2rem)] font-bold">{name}</h1>
              <h4 className="text-[max(1.3vw,1rem)] sm:pl-4">{date}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
