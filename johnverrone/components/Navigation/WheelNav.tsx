import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { NavItem } from './NavItem';
import { MENU_ITEMS } from './contants';

const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20%;
  height: 40px;
  display: flex;
  align-items: baseline;

  @media (min-width: ${(p) => p.theme.responsive.small}) {
    left: 0;
    width: calc(100% - 80px);
    margin: 0 40px;
  }
`;

const PageTitle = styled.a`
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading2, 1.25rem);
  font-weight: bold;
  line-height: 40px;
  color: black;
  text-decoration: none;

  @media (min-width: ${(p) => p.theme.responsive.small}) {
    margin-right: auto;
  }
`;

const Divider = styled.hr`
  position: relative;
  top: 2px;
  align-self: center;
  height: 24px;
  margin: 0 8px;
  border: 1px solid;
  border-left-width: 0;

  @media (min-width: ${(p) => p.theme.responsive.small}) {
    display: none;
  }
`;

const Menu = styled(motion.ol)`
  font-family: var(--font-family-mono);
  list-style-type: none;
  padding: 0;
  margin-top: 4px;
`;

const MenuItem = styled(motion.li)`
  padding: 4px 0;

  @media (min-width: ${(p) => p.theme.responsive.small}) {
    text-align: right;
  }
`;

const MenuButton = styled(motion(Button))`
  position: relative;
  top: -1px;
  font-family: var(--font-family-mono);
  padding: 0;
  text-align: left;
  color: black;

  @media (min-width: ${(p) => p.theme.responsive.small}) {
    text-align: right;
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WheelNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  const currentPage = MENU_ITEMS.find((item) => item.slug === pathname)?.name;

  const toggleMenu = () => setOpen((o) => !o);

  const listVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.07,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  };

  const menuItemVariants = {
    visible: {
      opacity: 0.5,
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <Wrapper>
      <Link href="/" passHref>
        <PageTitle>johnverrone</PageTitle>
      </Link>
      <Divider />
      <MenuWrapper>
        <MenuButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
        >
          {currentPage}
        </MenuButton>
        <AnimatePresence>
          {open && (
            <Menu
              key="nav-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={listVariants}
              onClick={() => setOpen((o) => !o)}
            >
              {MENU_ITEMS.filter((item) => item.name !== currentPage).map(
                (item) => (
                  <MenuItem key={item.slug} variants={menuItemVariants}>
                    <Link href={item.slug} passHref>
                      <NavItem>{item.name}</NavItem>
                    </Link>
                  </MenuItem>
                )
              )}
            </Menu>
          )}
        </AnimatePresence>
      </MenuWrapper>
    </Wrapper>
  );
};
