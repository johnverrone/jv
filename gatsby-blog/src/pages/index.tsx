import React from 'react';
import SEO from '../components/SEO';
import Splash from '../components/Splash';

const IndexPage: React.FC = () => (
  <>
    <SEO title="Home" description="Software engineer located in Atlanta, GA" />
    <Splash />
  </>
);

export default IndexPage;
