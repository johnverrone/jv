import React from 'react';
import styled from '../core/styled';

const Wrapper = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${props => props.theme.fontWeights.semiBold};
  }
`;

interface ContentProps {
  markdown?: any;
}

const Content: React.FC<ContentProps> = ({ markdown, children }) => {
  return markdown
    ? <Wrapper dangerouslySetInnerHTML={{ __html: markdown.childMarkdownRemark.html }} />
    : <Wrapper>{children}</Wrapper>
}

export default Content;

