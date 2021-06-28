import React from 'react';
import { GetStaticProps } from 'next';
import { BlogList } from '@components/BlogList';
import { SEO } from '@components/SEO';
import { getAllPosts } from '@lib/blog';

export default function BlogPage({ posts }) {
  return (
    <SEO title="John's Daily Journal">
      <BlogList basePath="/daily/john" posts={posts} />
    </SEO>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();

  return {
    props: { posts },
  };
};
