import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticProps } from 'next';
import { getAllPosts, Post } from '@lib/blog';
import { BlogList } from '@components/BlogList';
import { BlogItem } from '@components/BlogItem';
import { EmptyPage } from '@components/EmptyPage';

interface BlogPageProps {
  posts: Post[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <SEO title="John and Molly | Blog" />
      <AppContainer>
        {posts.length ? (
          <BlogList>
            {posts.map(blog => (
              <BlogItem blog={blog} key={blog.slug} />
            ))}
          </BlogList>
        ) : (
          <EmptyPage />
        )}
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
