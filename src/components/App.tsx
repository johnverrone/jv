import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './shared/Header';
import styles from './App.module.scss';

const App: React.FC = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={styles.app}>
      <Header siteTitle={data.site.siteMetadata.title} />
      {children}
    </div>
  );
};

export default App;
