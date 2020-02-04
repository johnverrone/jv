import React from 'react';
import Link from 'gatsby-link';
import styled from '@emotion/styled';

const Container = styled.div`
  padding-top: 4em;
`;

interface BlogListProps {
  posts: any[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <Container>
      <ul>
        { posts.map(({ node: p }) => (
          <li key={p.id}>
            <Link to={`/blog/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default BlogList;
