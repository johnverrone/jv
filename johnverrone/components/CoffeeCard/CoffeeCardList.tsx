import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.div`
  margin: 0 auto;

  width: 90%;
  max-width: ${(props) => props.theme.responsive.max};

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const CoffeeCardList: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};
