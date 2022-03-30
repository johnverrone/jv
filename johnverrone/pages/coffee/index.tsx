import React from 'react';
import { SEO } from '@components/SEO';
import styled from '@emotion/styled';
import Link from 'next/link';
import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { GetServerSideProps } from 'next';
import { CoffeeBrew } from '@lib/coffee/types';

interface CoffeePageProps {
  coffees: CoffeeBrew[];
}

const Title = styled.a`
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading2);
  line-height: 60px;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: black;
`;

const CoffeePage: React.FC<CoffeePageProps> = ({ coffees }) => {
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <Title>johnverrone</Title>
      </Link>
      {coffees.map((d) => (
        <div key={d.id}>
          {d.name} - {d.roaster}
        </div>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<CoffeePageProps> =
  async () => {
    const coffees = await getAllCoffeeBrews();
    return { props: { coffees } };
  };

export default CoffeePage;
