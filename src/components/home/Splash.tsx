import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import styles from './Splash.module.scss';

const Splash: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "bg.jpg" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  const imageData = data.file.childImageSharp.fluid;

  return (
    <BackgroundImage
      Tag="section"
      className={styles.splash}
      fluid={imageData}
      backgroundColor={`#222222`}
      style={{
        // Defaults are overwrite-able by setting one or each of the following:
        backgroundSize: 'cover',
        backgroundPosition: '50% 20%',
        backgroundRepeat: '',
      }}
    >
    </BackgroundImage>
  );
}

export default Splash;
