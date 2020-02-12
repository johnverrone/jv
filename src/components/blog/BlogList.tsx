import React from 'react';
import Link from 'gatsby-link';
import styled from '../core/styled';

const Container = styled.div`
  padding: 4em 1.5em;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 4em 3em;
  }
`;

const TitleWrapper = styled.div`
  margin-bottom: 2rem;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const List = styled.ul``;

const Item = styled.li``;

const Post = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  padding: 2rem 0;
  &:hover {
    h2 {
      color: ${props => props.theme.colors.accent};
    }
    p {
      opacity: 0.5;
    }
  }
`;

const PostTitle = styled.h2`
  font-size: 1.296rem;
  font-weight: ${props => props.theme.fontWeights.semiBold};
  transition: color 0.3s;
`;

const Description = styled.p`
  transition: opacity 0.3s;
`;

const Date = styled.p`
  font-size: 0.9rem;
  opacity: 0.5;
`;

interface BlogListProps {
  // TODO: figure out how to get proptype from contentful
  posts: any[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <Container>
      <TitleWrapper>
        <Title>Posts</Title>
      </TitleWrapper>
      <List>
        {posts.map(({ node: p }) => (
          <Item key={p.id}>
            <Post to={`/blog/${p.slug}`}>
              <PostTitle>{p.title}</PostTitle>
              <Description>{p.body.childMarkdownRemark.excerpt}</Description>
              <Date>{p.publishDate}</Date>
            </Post>
          </Item>
        ))}
      </List>
    </Container>
  )
}

export default BlogList;
