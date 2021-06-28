import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from '@emotion/styled';
import { ParsedUrlQuery } from 'querystring';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPostIds, getPost, Post as PostType } from '@lib/blog';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { BlogTitle } from '@components/BlogTitle';

const BlogContent = styled.p``;

export default function Post({ postData, mdxSource }: PostProps) {
  const { title, date } = postData;
  return (
    <SEO title={title}>
      <AppContainer>
        <BlogTitle title={title} date={date} />
        <BlogContent>
          <MDXRemote {...mdxSource} />
        </BlogContent>
      </AppContainer>
    </SEO>
  );
}

interface PostProps {
  postData: PostType;
  mdxSource: MDXRemoteSerializeResult;
}

interface RouteProps extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<RouteProps> = async () => {
  const postIds = await getAllPostIds();
  const paths = postIds.map(id => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps, RouteProps> = async ({
  params,
}) => {
  const postData = await getPost(params.id);
  const mdxSource = await serialize(postData.content);

  return {
    props: {
      postData,
      mdxSource,
    },
  };
};
