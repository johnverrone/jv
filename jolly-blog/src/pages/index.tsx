import React from 'react';
import SEO from '../components/SEO';
import styled from '../styles/styled';

const Splash = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndexPage: React.FC = () => (
  <>
    <SEO title="Home" description="Software engineer located in Atlanta, GA" />
    <Splash>Gatsby site is up!</Splash>
  </>
);

export default IndexPage;
