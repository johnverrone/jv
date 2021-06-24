import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: ${props => props.theme.fontWeights.semiBold};
    line-height: 1.15;
    margin: 0 0 1.25rem;
  }

  h1 {
    font-size: 1.866em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.866em;
  }

  h6 {
    font-size: 0.667em;
  }

  p {
    margin-bottom: 2em;
  }

  ul {
    margin-bottom: 2em;
    list-style: disc inside;
  }

  li {
  }
`;

interface ContentProps {
  html?: any;
}

const Content: React.FC<ContentProps> = ({ html, children }) => {
  return html ? (
    <Wrapper dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <Wrapper>{children}</Wrapper>
  );
};

export default Content;
