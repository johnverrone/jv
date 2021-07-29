import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug, Post } from '@lib/blog';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { ParsedUrlQuery } from 'querystring';

interface PostWithMdx extends Post {
  mdxSource: MDXRemoteSerializeResult;
}

interface BlogPageProps {
  post: PostWithMdx;
}

interface RouteProps extends ParsedUrlQuery {
  slug: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ post }) => {
  return (
    <>
      <SEO title={`John and Molly | ${post.title}`} />
      <AppContainer>
        <div>
          <MDXRemote {...post.mdxSource} />
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

  const loadContent = async (p: Post) => {
    const mdxSource = await serialize(p.content);
    return { ...p, mdxSource };
  };

  const postWithMdx = await loadContent(post);

  return {
    props: {
      post: postWithMdx,
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
