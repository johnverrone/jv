import React from 'react';
import { GetStaticProps } from 'next';
import BlogList from '../../../components/BlogList';
import Layout from '../../../components/Layout';
import { getAllPosts } from '../../../lib/blog';

export default function BlogPage({ posts }) {
  return (
    <Layout title="John's Daily Journal">
      <BlogList basePath="/daily/john" posts={posts} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();

  return {
    props: { posts },
  };
};
