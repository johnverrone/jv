import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import { getAllPostIds, getPost } from '../../lib/blog';
import { ParsedUrlQuery } from 'querystring';

export default function Post({ title }) {
  return <Layout title="title">{title}</Layout>;
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

interface Props {
  postData: {
    title: string;
  };
}

export const getStaticProps: GetStaticProps<Props, RouteProps> = async ({
  params,
}) => {
  const postData = await getPost(params.id);

  return {
    props: {
      postData,
    },
  };
};
