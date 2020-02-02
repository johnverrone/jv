import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

const Header = styled.header`
  position: fixed;
  width: 100%;
  z-index: 99;
  background-color: $header-color;
`;

const Nav = styled.nav`
  margin: 0 auto;
  padding: 0 3rem; // maybe use 1.5rem here for small screens
  max-width: 1380px;
  line-height: 4rem;
  display: flex;
  justify-content: space-between;
`;

interface HeaderProps {
  siteTitle?: string;
}

const AppHeader: React.FC<HeaderProps> = ({ siteTitle = '' }) => (
  <Header>
    <Nav>
      <h1>
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
      <ul>
        <Link to="/blog">Blog</Link>
      </ul>
    </Nav>
  </Header>
);

export default AppHeader;
