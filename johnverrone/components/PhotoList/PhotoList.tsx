import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.ul`
  list-style-type: none;
  padding: 0;

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const PhotoList: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};
