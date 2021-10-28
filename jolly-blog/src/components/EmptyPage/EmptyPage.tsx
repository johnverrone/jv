import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

export const EmptyPage: React.FC = () => (
  <Wrapper>
    <h2>Uh oh. Nothing&apos;s here!</h2>
    <p>...yet. check back soon</p>
  </Wrapper>
);
