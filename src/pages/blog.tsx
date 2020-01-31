import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/shared/SEO';
import styles from './blog.module.scss';

interface BlogPageProps {
  data: {
    allMarkdownRemark: {
      edges: any[];
    }
  }
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <>
      <SEO title="Blog" />
      <div className={styles.blogContainer}>
        { posts.map(({ node: p }) => <p key={p}>{p.frontmatter.title}</p>)}
      </div>
    </>
  )
}

export default BlogPage;
export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
