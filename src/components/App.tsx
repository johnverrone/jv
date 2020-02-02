import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Global } from '@emotion/core';
import styled from '@emotion/styled';
import { reset } from '../styles/reset';
import Header from './shared/Header';

const Root = styled.div`
  font-family: "Open Sans",inter ui,-apple-system,BlinkMacSystemFont,roboto,segoe ui,Helvetica,Arial,sans-serif;
  color: #222;
  line-height: 200%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

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
    <>
      <Global styles={reset} />
      <Root>
        <Header siteTitle={data.site.siteMetadata.title} />
        {children}
      </Root>
    </>
  );
};

export default App;
