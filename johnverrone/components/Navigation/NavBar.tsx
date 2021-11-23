import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { NavItem } from './NavItem';
import { MENU_ITEMS } from './contants';

const Wrapper = styled.nav`
  position: relative;
  top: 20px;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-family: var(--font-family-mono);
`;

export const NavBar = () => {
  return (
    <Wrapper>
      {MENU_ITEMS.map((item) => (
        <Link key={item.slug} href={item.slug} passHref>
          <NavItem>{item.name}</NavItem>
        </Link>
      ))}
    </Wrapper>
  );
};
