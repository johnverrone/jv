import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

const Wrapper = styled.a`
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: hsl(0deg 0% 100% / 80%);
  border: 1px solid hsl(0deg 0% 90%);
  box-shadow: var(--shadow-elevation-medium);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2rem;
  text-decoration: none;
`;

export const CoffeeButton: React.FC = () => {
  return (
    <Link href="/coffee" passHref>
      <Wrapper>☕️</Wrapper>
    </Link>
  );
};
