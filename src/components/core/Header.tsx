import React, {useState} from 'react';
import { Link } from 'gatsby';
import { motion } from 'framer-motion';
import styled from './styled';

type MenuProps = {
  open: boolean;
}

const Header = styled.header<MenuProps>`
  background-color: ${props => props.theme.colors.background};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: ${props => props.open ? '100%' : '60px'};
  z-index: 99;
  transition: max-height 0.5s cubic-bezier(.14,.44,.55,1);
`;

const Nav = styled(motion.nav)`
  margin: 0 auto;
  padding: 0 1.5rem;
  max-width: ${props => props.theme.responsive.max};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 0 3rem;
  }
`;

const List = styled(motion.ul)<MenuProps>`
  width: 100%;
  text-align: center;
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Item = styled(motion.li)`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  font-size: 1.25rem;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    opacity: 1 !important;
    pointer-events: auto;
    margin-left: .75rem;
    padding: 0;
    font-size: 1rem;
  }
  &:first-of-type {
    opacity: 1 !important;
    position: fixed;
    pointer-events: auto;
    top: 0;
    left: 1.5rem;
    font-size: 1rem;
    line-height: 60px;
    padding: 0;
    margin: 0;
    @media screen and (min-width: ${props => props.theme.responsive.medium}) {
      position: relative;
      left: 0;
      margin-right: auto;
    }
  }
  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
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
  height: 60px;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: none;
  }
  span {
    display: block;
    background-color: ${props => props.theme.colors.text};
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

interface AppHeaderProps {
  siteTitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ siteTitle = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  const close = () => {
    setIsOpen(false);
  }

  const itemVariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    }
  }

  const listVariants = {
    open: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.07,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    }
  }

  return (
    <Header open={isOpen}>
      <Nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
      >
        <MenuToggle open={isOpen} onClick={toggle} aria-label="Toggle Menu">
          <span />
          <span />
        </MenuToggle>
        <List variants={listVariants} open={isOpen}>
          <Item variants={itemVariants} positionTransition>
            <Link to="/" onClick={close}>{siteTitle}</Link>
          </Item>
          <Item variants={itemVariants}>
            <Link to="/blog" onClick={close}>Blog</Link>
          </Item>
        </List>
      </Nav>
    </Header>
  );
}

export default AppHeader;
