import Link from 'next/link';
import React from 'react';

export default function ArchivesPages() {
  return (
    <div className="font-mono">
      <h1 className="text-lg font-bold">the archives</h1>
      <ul className="list-disc ps-10 py-4">
        <li>
          <Link
            href="https://jolly-johnverrone1.vercel.app/"
            target="_blank"
            className="underline hover:text-orange-500"
          >
            wedding website
          </Link>
        </li>
      </ul>
    </div>
  );
}
