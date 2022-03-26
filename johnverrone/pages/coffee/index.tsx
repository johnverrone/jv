import React from 'react';
import { SEO } from '@components/SEO';
import styled from '@emotion/styled';
import Link from 'next/link';
import { getAllCoffeeBrews } from '@lib/coffee/brews';

const Airtable = styled.iframe`
  position: absolute;
  top: 60px;
  width: 100%;
  height: calc(100% - 60px);
`;

const Title = styled.a`
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading2);
  line-height: 60px;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: black;
`;

const CoffeePage: React.FC = () => {
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref>
        <Title>johnverrone</Title>
      </Link>
      <Airtable
        title="airtable-embed"
        src="https://airtable.com/embed/shrHQSvgnRIlpgXE4?backgroundColor=greenLight&viewControls=on"
        frameBorder="0"
      />
    </>
  );
};

export async function getServerSideProps() {
  const data = await getAllCoffeeBrews();
  return { props: { data } };
}

export default CoffeePage;
