import React from 'react';
import { graphql, Link } from 'gatsby';
import SEO from '../components/shared/SEO';
import styles from './blog.module.scss';

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
      <div className={styles.blogContainer}>
        { posts.map(({ node: p }) => (
          <li key={p.id}>
            <Link to={`/blog/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </div>
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
