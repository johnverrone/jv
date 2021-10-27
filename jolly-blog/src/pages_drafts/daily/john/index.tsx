import React from 'react';
import { GetServerSideProps } from 'next';
import { JournalList } from '@components/JournalList';
import { SEO } from '@components/SEO';
import { getAllPosts, Post } from '@lib/journals';
import { AppContainer } from '@components/AppContainer';

interface BlogPageProps {
  posts: Post[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <SEO title="John's Daily Journal" />
      <AppContainer>
        <JournalList basePath="/daily/john" posts={posts} />
      </AppContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async () => {
  const posts = await getAllPosts();

  return {
    props: {
      notFound: process.env.NODE_ENV === 'production',
      posts,
    },
  };
};

export default BlogPage;
