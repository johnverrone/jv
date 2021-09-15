import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { Post } from '@lib/journals';
import { formatDate } from '@utils/date';

const List = styled.div``;

const Item = styled.div``;

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

interface JournalListProps {
  posts: Post[];
  basePath: string;
}

export const JournalList: React.FC<JournalListProps> = ({
  posts,
  basePath,
}) => {
  const years = new Map();
  posts.forEach((post, i) => {
    const year = new Date(post.date.start).getFullYear();
    if (!years.has(year)) {
      years.set(year, i);
    }
  });

  return (
    <List>
      {posts.map(({ id, title, date }, i) => {
        const postYear = new Date(date.start).getFullYear();
        return (
          <Item key={id}>
            <Link href={`${basePath}/${id}`} passHref>
              <PostSnippet>
                {years.get(postYear) === i && <Year>{postYear}</Year>}
                <PostTitle>{title}</PostTitle>
                <DateComponent>{formatDate(date)}</DateComponent>
              </PostSnippet>
            </Link>
          </Item>
        );
      })}
    </List>
  );
};
