import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticProps } from 'next';
import Link from 'next/link';

const CoffeePage: React.FC = () => {
  return (
    <>
      <SEO title="Coffee" />
      <AppContainer>
        <iframe className="airtable-embed" src="https://airtable.com/embed/shrHQSvgnRIlpgXE4?backgroundColor=greenLight&viewControls=on" frameBorder="0" onMouseWheel="" width="100%" height="533" style={{ background: 'transparent', border: '1px solid #ccc' }}></iframe>
      </AppContainer>
    </>
  );
};

export default CoffeePage;
