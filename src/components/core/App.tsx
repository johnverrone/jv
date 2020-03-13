import React from 'react';
import { useStaticQuery, graphql, PageRendererProps } from 'gatsby';
import { Global } from '@emotion/core';
import styled from './styled';
import { reset } from '../../styles/reset';
import Header from './Header';
import Transition from './Transition';

const RootStyles = styled.div`
  font-family: "Open Sans",inter ui,-apple-system,BlinkMacSystemFont,roboto,segoe ui,Helvetica,Arial,sans-serif;
  color: ${props => props.theme.colors.text};
  line-height: 200%;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC<PageRendererProps> = (props) => {
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
      <RootStyles>
        <Header siteTitle={data.site.siteMetadata.title} />
        <Transition {...props}>
          <Root>{props.children}</Root>
        </Transition>
      </RootStyles>
    </>
  );
};

export default App;
