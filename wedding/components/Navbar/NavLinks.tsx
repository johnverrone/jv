import { Hearts } from 'components/Hearts';
import { motion } from 'framer-motion';
import { useHover } from 'hooks/useHover';
import Link from 'next/link';
import React from 'react';

interface NavLinksProps {
  onClick?: React.ComponentProps<typeof NavLink>['onClick'];
}

export const NavLinks = ({ onClick }: NavLinksProps) => {
  return (
    <>
      <NavLink onClick={onClick} href="/">
        Home
      </NavLink>
      <NavLink onClick={onClick} href="/our-story">
        Our Story
      </NavLink>
      <NavLink onClick={onClick} href="/weekend">
        Wedding Weekend
      </NavLink>
      <NavLink onClick={onClick} href="/registry">
        Registry
      </NavLink>
      <NavLink onClick={onClick} href="/rsvp">
        RSVP
      </NavLink>
    </>
  );
};

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  onClick?: React.ComponentProps<'a'>['onClick'];
}

const NavLink = ({ onClick, children, ...linkProps }: NavLinkProps) => {
  const [ref, hovered] = useHover<HTMLAnchorElement>();

  return (
    <motion.li whileHover={{ scale: 1.2 }}>
      <Link {...linkProps}>
        <a onClick={onClick} ref={ref}>
          <Hearts active={hovered}>{children}</Hearts>
        </a>
      </Link>
    </motion.li>
  );
};
