import { Hearts } from '../Hearts';
import { motion } from 'framer-motion';
import { useHover } from '../../hooks/useHover';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import css from './NavLinks.module.scss';

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
        href="/schedule"
        active={activeRoute === '/schedule'}
      >
        Schedule
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/hotels"
        active={activeRoute === '/hotels'}
      >
        Hotels
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/evergreen"
        active={activeRoute === '/evergreen'}
      >
        Things To Do
      </NavLink>
      <NavLink onClick={onClick} href="/faq" active={activeRoute === '/faq'}>
        FAQs
      </NavLink>
      <NavLink
        onClick={onClick}
        href="/registry"
        active={activeRoute === '/registry'}
      >
        Registry
      </NavLink>
      <NavLink onClick={onClick} href="/rsvp" button>
        RSVP
      </NavLink>
    </>
  );
};

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  onClick?: React.ComponentProps<'a'>['onClick'];
  active?: boolean;
  button?: boolean;
}

const NavLink = ({
  onClick,
  active = false,
  button = false,
  children,
  ...linkProps
}: NavLinkProps) => {
  const [ref, hovered] = useHover<HTMLAnchorElement>();

  return button ? (
    <li>
      <Link
        href={linkProps.href}
        onClick={onClick}
        className={classNames('buttonLink', css.buttonLink)}
      >
        <span>{children}</span>
      </Link>
    </li>
  ) : (
    <motion.li whileHover={{ scale: 1.2 }}>
      <Link
        {...linkProps}
        onClick={onClick}
        ref={ref}
        className={classNames({ [css.active]: active })}
      >
        <Hearts active={hovered}>
          <span className={classNames({ [css.active]: active })}>
            {children}
          </span>
        </Hearts>
      </Link>
    </motion.li>
  );
};
