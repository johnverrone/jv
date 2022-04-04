import styled from '@emotion/styled';
import { CoffeeBrew } from '@lib/coffee/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Link as A } from '@components/Link';
import { CurrentlyBrewing } from './CurrentlyBrewing';

const Wrapper = styled.article`
  border-radius: var(--border-radius-tight);
  border: thin solid hsla(0deg 0% 0% / 10%);

  overflow: hidden;
  display: flex;
  flex-direction: column;

  font-family: var(--font-family-body);
`;

const CoffeeInfo = styled.section`
  padding: 10px 20px;
  flex: 1;
`;

const CoffeeName = styled.h2`
  font-family: var(--font-family-heading);
  margin-bottom: 12px;
`;

const ImageContainer = styled.div`
  height: 300px;
  position: relative;
`;

const PropertyList = styled.dl``;

const PropertyTitle = styled.dt`
  text-transform: uppercase;
  color: var(--color-grey-medium);
  font-size: var(--font-size-property-key);
`;

const PropertyValue = styled.dd`
  margin-bottom: 12px;
`;

interface CoffeeCardProps {
  coffee: CoffeeBrew;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee }) => {
  const coffeeRoasterString = coffee.roaster.map((r) => r.name).join(', ');
  const coffeeRoasterNode: React.ReactNode = coffee.roaster.map(
    (roaster, i) => (
      <>
        <Link href={`/roaster/${roaster.id}`} passHref>
          <A>{roaster.name}</A>
        </Link>
        {i < coffee.roaster.length - 1 && ', '}
      </>
    )
  );

  return (
    <Wrapper>
      {coffee.imageUrl && (
        <ImageContainer>
          <Image
            src={coffee.imageUrl}
            alt={`Coffee bag artwork for ${coffee.name} from ${coffeeRoasterString}`}
            layout="fill"
            objectFit="cover"
          />
        </ImageContainer>
      )}
      <CoffeeInfo>
        <CoffeeName>
          <Link href={`/coffee/${coffee.id}`} passHref>
            <A>{coffee.name}</A>
          </Link>
        </CoffeeName>
        <PropertyList>
          <PropertyTitle>Roaster</PropertyTitle>
          <PropertyValue>{coffeeRoasterNode}</PropertyValue>
          <PropertyTitle>Origin</PropertyTitle>
          <PropertyValue>{coffee.origin}</PropertyValue>
          <PropertyTitle>Flavors</PropertyTitle>
          <PropertyValue>{coffee.flavors?.join(', ')}</PropertyValue>
          <PropertyTitle>Rating</PropertyTitle>
          <PropertyValue>{coffee.rating}</PropertyValue>
        </PropertyList>
      </CoffeeInfo>
      {coffee.currentlyBrewing && <CurrentlyBrewing />}
    </Wrapper>
  );
};
