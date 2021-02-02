import React from 'react';
import Title from '../components/Title';
import Content from '../components/Content';
import styled from '../components/styled';

const PostContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 4em 3em;
  max-width: ${props => props.theme.responsive.medium};
`;

const Post = ({ pageContext }) => {
  const { title, publishDate, body } = pageContext;

  return (
    <PostContainer>
      <Title title={title} date={publishDate} />
      <Content markdown={body} />
    </PostContainer>
  );
};

export default Post;
