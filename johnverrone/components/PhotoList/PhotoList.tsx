import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Wrapper = styled.ul`
  list-style-type: none;
  padding: 0;

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const PhotoList = ({ children }: { children: ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};
