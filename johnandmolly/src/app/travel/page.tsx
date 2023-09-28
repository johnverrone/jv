import Image from 'next/image';
import React from 'react';

export default function TravelPage() {
  const locations = [
    {
      name: 'Norway',
      date: 'September 2023',
    },
    {
      name: 'Sweden',
      date: 'September 2023',
    },
    {
      name: 'Denmark',
      date: 'September 2023',
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      {locations.map(({ name, date }) => (
        <div className="flex" key={`${name}-${date}`}>
          <div className="bg-slate-200 rounded-2xl w-60 h-60">
            <Image src="/image" width={250} height={250} alt="photo" />
          </div>
          <div className="pt-8">
            <h1 className="text-8xl font-bold -ms-14">{name}</h1>
            <h4 className="text-2xl ms-16">{date}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
