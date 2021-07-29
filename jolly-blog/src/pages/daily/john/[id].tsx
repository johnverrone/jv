import React from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getPost, Post as PostType } from '@lib/journals';
import { SEO } from '@components/SEO';
import { JournalTitle } from '@components/JournalTitle';
import { FullBleedContainer } from '@components/FullBleedContainer';

interface PostProps {
  postData: PostType;
  mdxSource: MDXRemoteSerializeResult;
}

interface RouteProps extends ParsedUrlQuery {
  id: string;
}

const JournalPage: React.FC<PostProps> = ({ postData, mdxSource }) => {
  const { title, date } = postData;
  return (
    <>
      <SEO title={title} />
      <FullBleedContainer>
        <JournalTitle title={title} date={date} />
        <div>
          <MDXRemote {...mdxSource} />
        </div>
      </FullBleedContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  PostProps,
  RouteProps
> = async ({ params }) => {
  if (!params) return { notFound: true };
  const postData = await getPost(params.id);
  if (!postData) return { notFound: true };

  const mdxSource = await serialize(postData.content || '_no content_ 😢');

  return {
    props: {
      postData,
      mdxSource,
    },
  };
};

export default JournalPage;
