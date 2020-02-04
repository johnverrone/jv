import React, {useState} from 'react';
import { Link } from 'gatsby';
import styled from './styled';

type MenuProps = {
  open: boolean;
}

const Header = styled.header<MenuProps>`
  background-color: #222;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: ${props => props.open ? '100%' : '40px'};
  z-index: 99;
  transition: max-height 0.5s cubic-bezier(.14,.44,.55,1);
`;

const Nav = styled.nav`
  margin: 0 auto;
  padding: 0 1.5rem;
  max-width: 1380px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (min-width: 800px) {
    padding: 0 3rem;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
`;

const List = styled.ul<MenuProps>`
  width: 100%;
  text-align: center;
  @media screen and (min-width: 800px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Item = styled.li<MenuProps>`
  display: ${props => props.open ? 'flex' : 'none'};
  justify-content: center;
  padding: 0.5rem 0;
  font-size: 1.25rem;
  @media screen and (min-width: 800px) {
    display: inline !important;
    margin-left: .75rem;
    padding: 0;
    font-size: 1rem;
  }
  &:first-of-type {
    display: flex !important;
    position: fixed;
    top: 0;
    left: 1.5rem;
    font-size: 1rem;
    line-height: 40px;
    padding: 0;
    @media screen and (min-width: 800px) {
      position: relative;
      left: 0;
      margin-right: auto;
    }
  }

`;

const MenuToggle = styled.button<MenuProps>`
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 1.5rem;
  width: 1.5rem;
  height: 40px;
  @media screen and (min-width: 800px) {
    display: none;
  }
  span {
    display: block;
    background-color: #fff;
    width: 100%;
    height: 2px;
  }
  span:first-of-type {
    transform: rotate(${props => (props.open ? '45deg' : '0')})
      translateY(${props => (props.open ? '0' : '.35rem')});
  }
  span:nth-of-type(2n) {
    transform: rotate(${props => (props.open ? '-45deg' : '0')})
      translateY(${props => (props.open ? '0' : '-.35rem')});
    position: relative;
    bottom: ${props => (props.open ? '2px' : '0')};
  }
`;

interface HeaderProps {
  siteTitle?: string;
}

const AppHeader: React.FC<HeaderProps> = ({ siteTitle = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  const close = () => {
    setIsOpen(false);
  }

  return (
    <Header open={isOpen}>
      <Nav>
        <MenuToggle open={isOpen} onClick={toggle} aria-label="Toggle Menu">
          <span />
          <span />
        </MenuToggle>
        <List open={isOpen}>
          <Item open={isOpen}><Link to="/" onClick={close}>{siteTitle}</Link></Item>
          <Item open={isOpen}><Link to="/blog" onClick={close}>Blog</Link></Item>
          <Item open={isOpen}><Link to="/blog" onClick={close}>Blog</Link></Item>
          <Item open={isOpen}><Link to="/blog" onClick={close}>Blog</Link></Item>
          <Item open={isOpen}><Link to="/blog" onClick={close}>Blog</Link></Item>
        </List>
      </Nav>
    </Header>
  );
}

export default AppHeader;
