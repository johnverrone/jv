import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/shared/SEO';
import BlogList from '../components/shared/BlogList';

interface BlogPageProps {
  data: {
    allContentfulBlogPost: {
      edges: any[];
    }
  }
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const posts = data.allContentfulBlogPost.edges;

  return (
    <>
      <SEO title="Blog" />
      <BlogList posts={posts} />
    </>
  )
}

export default BlogPage;
export const query = graphql`
  query {
    allContentfulBlogPost {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
  }
`;
