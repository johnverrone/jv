import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Wrapper = styled.section`
  margin: 0 auto;

  width: 90%;
  max-width: ${(props) => props.theme.responsive.max};

  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const EmptySpace = styled.div`
  height: 120px;
`;

export const CoffeeCardList = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Wrapper>{children}</Wrapper>
      <EmptySpace />
    </>
  );
};
