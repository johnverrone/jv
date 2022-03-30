import React from 'react';
import { SEO } from '@components/SEO';
import styled from '@emotion/styled';
import Link from 'next/link';
import { getAllCoffeeBrews } from '@lib/coffee/brews';
import { InferGetServerSidePropsType } from 'next';

const Title = styled.a`
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading2);
  line-height: 60px;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: black;
`;

const CoffeePage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
  console.log({ data });
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <Title>johnverrone</Title>
      </Link>
      {data.map((d) => (
        <div key={d.id}>
          {d.name} - {d.roaster}
        </div>
      ))}
    </>
  );
};

export async function getServerSideProps() {
  const data = await getAllCoffeeBrews();
  return { props: { data } };
}

export default CoffeePage;
