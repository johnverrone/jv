import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { Post } from '@lib/blog';

const Container = styled.a`
  text-align: center;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const BlogTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
`;

const BlogMetadata = styled.div``;

interface BlogItemProps {
  blog: Post;
}

export const BlogItem: React.FC<BlogItemProps> = ({ blog }) => (
  <Link href={`/blog/${blog.slug}`} passHref>
    <Container>
      <BlogMetadata>
        <BlogTitle>{blog.title}</BlogTitle>
        <p>{blog.date}</p>
      </BlogMetadata>
    </Container>
  </Link>
);
