import { A } from '@components/A';
import {
  PropertyList,
  PropertyTitle,
  PropertyValue,
} from '@components/PropertyList';
import styled from '@emotion/styled';
import { CoffeeBrew } from '@lib/coffee/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, ReactNode } from 'react';
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
interface CoffeeCardProps {
  children?: ReactNode;
  coffee: CoffeeBrew;
}

export const CoffeeCard = ({ coffee }: CoffeeCardProps) => {
  const coffeeRoasterString = coffee.roaster.map((r) => r.name).join(', ');
  const coffeeRoasterNode: React.ReactNode = coffee.roaster.map(
    (roaster, i) => (
      <Fragment key={roaster.id}>
        {roaster.name}
        {i < coffee.roaster.length - 1 && ', '}
      </Fragment>
    )
  );

  return (
    <Wrapper>
      {coffee.imageUrl && (
        <ImageContainer>
          <Image
            src={coffee.imageUrl}
            alt={`Coffee bag artwork for ${coffee.name} from ${coffeeRoasterString}`}
            width={400}
            height={400}
            style={{
              height: 'auto',
              objectFit: 'cover',
              aspectRatio: '1/1',
            }}
          />
        </ImageContainer>
      )}
      <CoffeeInfo>
        <CoffeeName>
          <Link href={`/coffee/${coffee.id}`} passHref legacyBehavior>
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
