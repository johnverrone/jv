import styled from '@emotion/styled';
import { CoffeeBrew } from '@lib/coffee/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Wrapper = styled.div`
  padding: 10px 20px;
  border-radius: var(--border-radius-tight);
  border: thin solid hsla(0deg 0% 0% / 15%);
`;

const CoffeeName = styled.a`
  font-family: var(--font-family-heading);
`;

const RoasterName = styled.h5`
  font-family: var(--font-family-heading);
`;

interface CoffeeCardProps {
  coffee: CoffeeBrew;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee }) => {
  return (
    <Wrapper>
      {coffee.imageUrl && (
        <Image
          src={coffee.imageUrl}
          alt={`Coffee bag artwork for ${coffee.name} from ${coffee.roaster.name}s`}
        />
      )}
      <Link href={`/coffee/${coffee.id}`} passHref>
        <CoffeeName>{coffee.name}</CoffeeName>
      </Link>
      <RoasterName>{coffee.roaster.name}</RoasterName>
    </Wrapper>
  );
};
