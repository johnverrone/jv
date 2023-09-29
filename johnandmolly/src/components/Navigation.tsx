'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Navigation = () => {
  const pathname = usePathname();

  const linkClasses = (route: string) =>
    `inline-block py-2 -mb-px ${
      pathname === route
        ? 'font-bold border-b-2 border-black'
        : 'font-medium hover:border-b hover:border-black'
    }`;

  return (
    <nav className="full-bleed border-b">
      <ol className="max-w-[min(90%,768px)] mx-auto flex gap-5 text-lg">
        <li>
          <Link href="/about" className={linkClasses('/about')}>
            about
          </Link>
        </li>
        <li>
          <Link href="/travel" className={linkClasses('/travel')}>
            travel
          </Link>
        </li>
        <li>
          <Link href="/photos" className={linkClasses('/photos')}>
            photos
          </Link>
        </li>
        <li className="ml-auto">
          <Link href="/archives" className={linkClasses('/archives')}>
            archives
          </Link>
        </li>
      </ol>
    </nav>
  );
};
