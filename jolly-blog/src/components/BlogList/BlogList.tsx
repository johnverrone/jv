import React from 'react';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
`;

export const BlogList: React.FC = ({ children }) => <Grid>{children}</Grid>;
