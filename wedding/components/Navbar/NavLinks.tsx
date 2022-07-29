import { Hearts } from 'components/Hearts';
import { motion } from 'framer-motion';
import { useHover } from 'hooks/useHover';
import Link from 'next/link';
import React from 'react';
import css from './NavLinks.module.css';

interface NavLinksProps {
  onClick?: React.ComponentProps<typeof NavLink>['onClick'];
  activeRoute?: string;
}

export const NavLinks = ({ onClick, activeRoute }: NavLinksProps) => {
  return (
    <>
      <NavLink onClick={onClick} href="/" active={activeRoute === '/'}>
        Home
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/our-story"
        active={activeRoute === '/our-story'}
      >
        Our Story
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/weekend"
        active={activeRoute === '/weekend'}
      >
        Wedding Weekend
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/registry"
        active={activeRoute === '/registry'}
      >
        Registry
      </NavLink>
      <NavLink onClick={onClick} href="/rsvp" active={activeRoute === '/rsvp'}>
        RSVP
      </NavLink>
    </>
  );
};

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  onClick?: React.ComponentProps<'a'>['onClick'];
  active?: boolean;
}

const NavLink = ({
  onClick,
  active = false,
  children,
  ...linkProps
}: NavLinkProps) => {
  const [ref, hovered] = useHover<HTMLAnchorElement>();

  return (
    <motion.li whileHover={{ scale: 1.2 }}>
      <Link {...linkProps}>
        <a onClick={onClick} ref={ref} className={active ? css.active : ''}>
          <Hearts active={hovered}>
            <span className={active ? css.active : ''}>{children}</span>
          </Hearts>
        </a>
      </Link>
    </motion.li>
  );
};
