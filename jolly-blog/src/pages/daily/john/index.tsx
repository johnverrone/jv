import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { JournalList } from '@components/JournalList';
import { SEO } from '@components/SEO';
import { getAllPosts } from '@lib/journals';
import { AppContainer } from '@components/AppContainer';

const BlogPage = ({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SEO title="John's Daily Journal" />
      <AppContainer>
        <JournalList basePath="/daily/john" posts={posts} />
      </AppContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await getAllPosts();

  return {
    props: { posts },
  };
};

export default BlogPage;
