import { Boop } from 'components/Boop';
import Link from 'next/link';
import React from 'react';

interface NavLinksProps {
  onClick?: React.ComponentProps<'a'>['onClick'];
}

export const NavLinks = ({ onClick }: NavLinksProps) => (
  <>
    <li>
      <Boop>
        <Link href="/">
          <a onClick={onClick}>Home</a>
        </Link>
      </Boop>
    </li>
    <li>
      <Boop>
        <Link href="/our-story">
          <a onClick={onClick}>Our Story</a>
        </Link>
      </Boop>
    </li>
    <li>
      <Boop>
        <Link href="/weekend">
          <a onClick={onClick}>Wedding Weekend</a>
        </Link>
      </Boop>
    </li>
    <li>
      <Boop>
        <Link href="/registry">
          <a onClick={onClick}>Registry</a>
        </Link>
      </Boop>
    </li>
    <li>
      <Boop>
        <Link href="/rsvp">
          <a onClick={onClick}>RSVP</a>
        </Link>
      </Boop>
    </li>
  </>
);
