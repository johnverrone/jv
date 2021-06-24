import React from 'react';
import BlogList from '../components/BlogList';
import Layout from '../components/Layout';
import { getAllPosts } from '../lib/blog';

export default function BlogPage({ posts }) {
  return (
    <Layout title="blog">
      <BlogList posts={posts} />
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();

  return {
    props: { posts },
  };
}
