import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { BlogList } from '@components/BlogList';
import { SEO } from '@components/SEO';
import { getAllPosts } from '@lib/blog';
import { AppContainer } from '@components/AppContainer';

const BlogPage = ({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SEO title="John's Daily Journal" />
      <AppContainer>
        <BlogList basePath="/daily/john" posts={posts} />
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
