import React from 'react';
import Title from '../components/Title';
import Content from '../components/Content';
import styled from '../styles/styled';

const PostContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 4em 3em;
  max-width: ${props => props.theme.responsive.medium};
`;

const Post = ({ pageContext }) => {
  const { title, properties, childMarkdownRemark } = pageContext;

  return (
    <PostContainer>
      <Title title={title} date={properties.Date.value.start} />
      <Content html={childMarkdownRemark.html} />
    </PostContainer>
  );
};

export default Post;
