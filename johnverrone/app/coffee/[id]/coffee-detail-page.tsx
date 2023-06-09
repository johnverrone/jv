'use client';

import { A } from '@components/A';
import { AppContainer } from '@components/AppContainer';
import { CoffeeCard } from '@components/CoffeeCard';
import { SiteTitle } from '@components/SiteTitle';
import styled from '@emotion/styled';
import { CoffeeBrew } from '@lib/coffee/types';
import Link from 'next/link';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 500px;
`;

interface CoffeeDetailPageProps {
  coffee: CoffeeBrew;
}

const CoffeeDetailPage = ({ coffee }: CoffeeDetailPageProps) => (
  <>
    <Link href="/" passHref legacyBehavior>
      <SiteTitle>johnverrone</SiteTitle>
    </Link>
    <AppContainer>
      <Link href="/coffee" passHref legacyBehavior>
        <A>← all coffee</A>
      </Link>
      <Wrapper>
        <CoffeeCard coffee={coffee} />
      </Wrapper>
    </AppContainer>
  </>
);

export default CoffeeDetailPage;
