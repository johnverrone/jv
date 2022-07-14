import Link from 'next/link';
import React from 'react';

interface NavLinksProps {
  onClick?: React.ComponentProps<'a'>['onClick'];
}

export const NavLinks = ({ onClick }: NavLinksProps) => (
  <>
    <li>
      <Link href="/">
        <a onClick={onClick}>Home</a>
      </Link>
    </li>
    <li>
      <Link href="/our-story">
        <a onClick={onClick}>Our Story</a>
      </Link>
    </li>
    <li>
      <Link href="/weekend">
        <a onClick={onClick}>Wedding Weekend</a>
      </Link>
    </li>
    <li>
      <Link href="/registry">
        <a onClick={onClick}>Registry</a>
      </Link>
    </li>
    <li>
      <Link href="/rsvp">
        <a onClick={onClick}>RSVP</a>
      </Link>
    </li>
  </>
);
