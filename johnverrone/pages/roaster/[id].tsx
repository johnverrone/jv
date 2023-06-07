import { AppContainer } from '@components/AppContainer';
import { SEO } from '@components/SEO';
import { SiteTitle } from '@components/SiteTitle';
import Link from 'next/link';
import { useRouter } from 'next/router';

const RoasterDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <SEO title="Coffee" />
      <Link href="/" passHref legacyBehavior>
        <SiteTitle>johnverrone</SiteTitle>
      </Link>
      <AppContainer>
        <div>Coffee roaster: {id}</div>
      </AppContainer>
    </>
  );
};

export default RoasterDetailPage;
