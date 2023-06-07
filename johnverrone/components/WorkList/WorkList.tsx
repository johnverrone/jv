import styled from '@emotion/styled';
import { ReactNode } from 'react';

const List = styled.ul`
  list-style-type: none;
  padding: 0;

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

interface WorkListProps {
  children: ReactNode;
}

export const WorkList = ({ children }: WorkListProps) => {
  return <List>{children}</List>;
};
