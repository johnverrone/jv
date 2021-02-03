import React from 'react';
import Link from 'gatsby-link';
import Container from './Container';
import styled from '../styles/styled';

const TitleWrapper = styled.div`
  margin-bottom: 2rem;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const List = styled.ul``;

const Item = styled.li``;

const Post = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  padding: 2rem 0;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      'year title title desc desc desc'
      'year date date desc desc desc';
  }
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
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.semiBold};
  transition: color 0.3s;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    grid-area: title;
  }
`;

const Description = styled.p`
  transition: opacity 0.3s;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    grid-area: desc;
  }
`;

const Year = styled.h1`
  display: none;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: block;
    font-size: 1.866em;
    grid-area: year;
  }
`;

const DateComponent = styled.p`
  font-size: 0.9rem;
  opacity: 0.5;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    grid-area: date;
  }
`;

interface BlogListProps {
  // TODO: figure out how to get proptype from contentful
  posts: any[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const years = new Map();
  for (const [i, { node: post }] of posts.entries()) {
    const year = new Date(post.publishDate).getFullYear();
    if (!years.has(year)) {
      years.set(year, i);
      years[i] = year;
    }
  }

  return (
    <Container>
      <TitleWrapper>
        <Title>Posts</Title>
      </TitleWrapper>
      <List>
        {posts.map(({ node: p }, i) => {
          const postYear = new Date(p.publishDate).getFullYear();
          return (
            <Item key={p.id}>
              <Post to={`/blog/${p.slug}`}>
                {years.get(postYear) === i && <Year>{postYear}</Year>}
                <PostTitle>{p.title}</PostTitle>
                <Description>{p.body.childMarkdownRemark.excerpt}</Description>
                <DateComponent>{p.publishDate}</DateComponent>
              </Post>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default BlogList;
