import React from 'react';
import { graphql } from 'gatsby';
import Container from '../components/shared/Container';
import Title from '../components/shared/Title';
import Content from '../components/shared/Content';

const Post = ({ pageContext }) => {
  const { title, publishDate, body} = pageContext;

  return (
    <Container>
      <Title title={title} date={publishDate} />
      <Content markdown={body} />
    </Container>
  )
}

export default Post;
