import React from 'react';
import { useStaticQuery, graphql, PageRendererProps } from 'gatsby';
import { Global } from '@emotion/core';
import styled from './styles/styled';
import { reset } from './styles/reset';
import Header from './components/Header';
import Transition from './components/Transition';

const RootStyles = styled.div`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.text};
  line-height: 200%;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC<PageRendererProps> = props => {
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
