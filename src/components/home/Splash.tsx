import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';

const Splash: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      contentfulAsset(contentful_id: { eq: "E33uRF0Dk0DSoKrE83XH9" }) {
        fluid(maxWidth: 2000, quality: 100) {
          ...GatsbyContentfulFluid
        }
      }
    }
  `);

  const imageData = data.contentfulAsset.fluid;

  return (
    <BackgroundImage
      Tag="section"
      fluid={imageData}
      backgroundColor={`#222222`}
      style={{
        flex: 1,
        // Defaults are overwrite-able by setting one or each of the following:
        backgroundSize: 'cover',
        backgroundPosition: '50% 10%',
        backgroundRepeat: '',
      }}
    >
    </BackgroundImage>
  );
}

export default Splash;
