import React from 'react';
import styled from '@emotion/styled';

const List = styled.ul`
  list-style-type: none;
  padding: 0;

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

interface WorkListProps {}

export const WorkList: React.FC<WorkListProps> = ({ children }) => {
  return <List>{children}</List>;
};
