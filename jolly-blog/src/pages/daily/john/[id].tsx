import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from '@emotion/styled';
import { ParsedUrlQuery } from 'querystring';
import { getAllPostIds, getPost } from '../../../lib/blog';
import Layout from '../../../components/Layout';
import Container from '../../../components/Container';

const BlogTitle = styled.h2`
  font-size: 1.5rem;
  font-family: ${props => props.theme.fonts.heading};
`;

const BlogContent = styled.p`
  font-family: ${props => props.theme.fonts.body};
`;

export default function Post({ postData }: PostProps) {
  const { title, content } = postData;
  return (
    <Layout title={title}>
      <Container>
        <BlogTitle>{title}</BlogTitle>
        <BlogContent>{content}</BlogContent>
      </Container>
    </Layout>
  );
}

interface PostProps {
  postData: {
    title: string;
    content: string;
  };
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
