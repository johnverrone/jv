import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from '../components/core/styled';

const ImageContainer = styled.div`
  padding-top: 4em;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const InstagramPage = ({ data }) => {
  const pics = data.allInstaNode.edges;

  return (
    <ImageContainer>
      {pics.map(({ node: p }) => (
        <div key={p.id}>
          <Img fixed={p.localFile.childImageSharp.fixed} />
        </div>
      ))}
    </ImageContainer>
  )
}

export default InstagramPage;
export const query = graphql`
  query {
    allInstaNode {
      edges {
        node {
          id
          localFile {
            childImageSharp {
              fixed {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`;
