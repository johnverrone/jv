import React from 'react';
import { AppContainer } from '@components/AppContainer';
import { SEO } from '@components/SEO';
import { getAllPosts, getPostBySlug, Post } from '@lib/blog';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface BlogPageProps {
  post: Post;
  mdxSource: string;
}

interface RouteProps extends ParsedUrlQuery {
  slug: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ post, mdxSource }) => {
  const MDXComponent = React.useMemo(() => getMDXComponent(mdxSource), [
    mdxSource,
  ]);

  return (
    <>
      <SEO title={`John and Molly | ${post.title}`} />
      <AppContainer>
        <div>
          <MDXComponent />
        </div>
      </AppContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  BlogPageProps,
  RouteProps
> = async ({ params }) => {
  if (!params) return { notFound: true };

  const post = getPostBySlug(params.slug);

  const { code: mdxSource } = await bundleMDX(post.content);

  return {
    props: {
      post,
      mdxSource,
    },
  };
};

export const getStaticPaths: GetStaticPaths<RouteProps> = async () => {
  const posts = getAllPosts();
  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export default BlogPage;
