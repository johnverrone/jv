import React from 'react';
import SEO from '../components/core/SEO';
import Splash from '../components/home/Splash';

const IndexPage: React.FC = () => (
  <>
    <SEO title="Home" description="Software engineer located in Atlanta, GA"/>
    <Splash />
  </>
);

export default IndexPage;
