import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface BlogPageProps {
  post: { slug: string, title: string };
}

interface RouteProps extends ParsedUrlQuery {
  slug: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ post }) => {
  return (
    <>
      <SEO title={`John and Molly | ${post.title}`} />
      <AppContainer>
        <p>blog content here</p>
      </AppContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  BlogPageProps,
  RouteProps
> = async ({ params }) => {
  if (!params) return { notFound: true };

  const post = { slug: params.slug, title: `Blog ${params.slug}` };

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths<RouteProps> = async () => {
  return {
    paths: ['/blog/1', '/blog/2', '/blog/3'],
    fallback: false,
  };
};

export default BlogPage;
