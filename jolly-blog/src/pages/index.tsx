import React from 'react';
import Layout from '../components/Layout';
import styled from '@emotion/styled';

const Splash = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndexPage: React.FC = () => (
  <>
    <Layout title="Home" description="Software engineer located in Atlanta, GA">
      <Splash>Gatsby site is up!</Splash>
    </Layout>
  </>
);

export default IndexPage;
