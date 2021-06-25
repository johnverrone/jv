import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from '@emotion/styled';
import { ParsedUrlQuery } from 'querystring';
import { getAllPostIds, getPost, Post as PostType } from '../../../lib/blog';
import Layout from '../../../components/Layout';
import { AppContainer } from '../../../components/AppContainer';
import {BlogTitle} from '../../../components/BlogTitle';

const BlogContent = styled.p``;

export default function Post({ postData }: PostProps) {
  const { title, date, content } = postData;
  return (
    <Layout title={title}>
      <AppContainer>
        <BlogTitle title={title} date={date} />
        <BlogContent>{content}</BlogContent>
      </AppContainer>
    </Layout>
  );
}

interface PostProps {
  postData: PostType;
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

  return {
    props: {
      postData,
    },
  };
};
