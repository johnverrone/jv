import React from 'react';
import Link from 'next/link';
import Container from './Container';
import styled from '@emotion/styled';
import { Post } from '../lib/blog';

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

const PostSnippet = styled.a`
  display: block;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  padding: 2rem 0;
  background-color: transparent;
  border-radius: 8px;
  transition: background-color 280ms ease-out;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      'year title title desc desc desc'
      'year date date desc desc desc';
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  & * {
    pointer-events: none;
  }
`;

const PostTitle = styled.h2`
  font-size: 1.296rem;
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.semiBold};
  transition: color 0.3s;
  margin-bottom: 8px;
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
  font-family: ${props => props.theme.fonts.monospace};
  display: none;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    display: block;
    font-size: 1.866em;
    grid-area: year;
  }
`;

const DateComponent = styled.p`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: 0.9rem;
  opacity: 0.5;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    grid-area: date;
  }
`;

interface BlogListProps {
  // TODO: figure out how to get proptype from contentful
  posts: Post[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const years = new Map();
  posts.forEach((post, i) => {
    const year = new Date(post.date).getFullYear();
    if (!years.has(year)) {
      years.set(year, i);
      years[i] = year;
    }
  });

  return (
    <Container>
      <List>
        {posts.map(({ id, title, date }, i) => {
          const postYear = new Date(date).getFullYear();
          return (
            <Item key={id}>
              <Link href={`/blog/${id}`}>
                <PostSnippet>
                  {years.get(postYear) === i && <Year>{postYear}</Year>}
                  <PostTitle>{title}</PostTitle>
                  <DateComponent>{new Date(date).toDateString()}</DateComponent>
                </PostSnippet>
              </Link>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default BlogList;
