import React from 'react';
import { SEO } from '@components/SEO';
import styled from '@emotion/styled';

const Airtable = styled.iframe`
  position: absolute;
  top: 60px;
  width: 100%;
  height: calc(100% - 60px);
`;

const CoffeePage: React.FC = () => {
  return (
    <>
      <SEO title="Coffee" />
      <Airtable title="airtable-embed" src="https://airtable.com/embed/shrHQSvgnRIlpgXE4?backgroundColor=greenLight&viewControls=on" frameBorder="0" />
    </>
  );
};

export default CoffeePage;
