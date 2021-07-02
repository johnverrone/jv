import React from 'react';
import { GetStaticProps } from 'next';
import { BlogList } from '@components/BlogList';
import { SEO } from '@components/SEO';
import { getAllPosts } from '@lib/blog';
import { AppContainer } from '@components/AppContainer';

export default function BlogPage({ posts }) {
  return (
    <>
      <SEO title="John's Daily Journal" />
      <AppContainer>
        <BlogList basePath="/daily/john" posts={posts} />
      </AppContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();

  return {
    props: { posts },
  };
};
