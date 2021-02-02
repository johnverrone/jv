import React from 'react';
import Container from '../components/Container';
import SEO from '../components/SEO';

const IndexPage: React.FC = () => (
  <>
    <SEO title="Home" description="Software engineer located in Atlanta, GA" />
    <Container>Gatsby site is up!</Container>
  </>
);

export default IndexPage;
