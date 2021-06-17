import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/SEO';
import BlogList from '../components/BlogList';

interface BlogPageProps {
  data: {
    allNotion: {
      edges: any[];
    };
  };
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const posts = data.allNotion.edges;

  return (
    <>
      <SEO title="Blog" />
      <BlogList posts={posts} />
    </>
  );
};

export default BlogPage;
export const query = graphql`
  query {
    allNotion {
      edges {
        node {
          id
          title
          properties {
            Date {
              value {
                start(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    }
  }
`;
