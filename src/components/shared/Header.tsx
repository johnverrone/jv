import React from 'react';
import styles from './Header.module.scss';
import { Link } from 'gatsby';

interface HeaderProps {
  siteTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ siteTitle = '' }) => (
  <header className={styles.header}>
    <nav className={styles.navContainer}>
      <h1 style={{ margin: 0 }}>
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
      <ul className={styles.navLinks}>
        <Link to="/blog" className={styles.navLink}>
          Blog
        </Link>
      </ul>
    </nav>
  </header>
);

export default Header;
