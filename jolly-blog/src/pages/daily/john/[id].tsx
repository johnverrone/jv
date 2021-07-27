import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from '@emotion/styled';
import { ParsedUrlQuery } from 'querystring';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPostIds, getPost, Post as PostType } from '@lib/blog';
import { SEO } from '@components/SEO';
import { BlogTitle } from '@components/BlogTitle';
import { FullBleedContainer } from '@components/FullBleedContainer';

const BlogContent = styled.p``;

export default function Post({ postData, mdxSource }: PostProps) {
  if (!postData || !mdxSource) return null;

  const { title, date } = postData;
  return (
    <>
      <SEO title={title} />
      <FullBleedContainer>
        <BlogTitle title={title} date={date} />
        <BlogContent>
          <MDXRemote {...mdxSource} />
        </BlogContent>
      </FullBleedContainer>
    </>
  );
}

interface PostProps {
  postData?: PostType;
  mdxSource?: MDXRemoteSerializeResult;
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
  const postData = params ? await getPost(params.id) : null;
  if (!postData || !postData.content) return { props: {} };

  const mdxSource = await serialize(postData.content);

  return {
    props: {
      postData,
      mdxSource,
    },
  };
};
