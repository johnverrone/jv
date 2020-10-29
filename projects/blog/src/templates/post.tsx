import React from 'react';
import Title from '../components/shared/Title';
import Content from '../components/shared/Content';
import styled from '../components/core/styled';

const PostContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 4em 3em;
  max-width: ${props => props.theme.responsive.medium};
`;

const Post = ({ pageContext }) => {
  const { title, publishDate, body} = pageContext;

  return (
    <PostContainer>
      <Title title={title} date={publishDate} />
      <Content markdown={body} />
    </PostContainer>
  )
}

export default Post;
