import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticProps } from 'next';
import { getAllPosts, Post } from '@lib/blog';
import Link from 'next/link';

interface BlogPageProps {
  posts: Pick<Post, 'slug' | 'title'>[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <SEO title="John and Molly | Blog" />
      <AppContainer>
        {posts.map(p => (
          <Link href={`/blog/${p.slug}`} key={p.slug}>
            <a>
              <h1>{p.title}</h1>
            </a>
          </Link>
        ))}
      </AppContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
};

export default BlogPage;
