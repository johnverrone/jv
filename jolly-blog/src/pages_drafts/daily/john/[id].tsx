import React from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPost, Post as PostType } from '@lib/journals';
import { SEO } from '@components/SEO';
import { JournalTitle } from '@components/JournalTitle';
import { FullBleedContainer } from '@components/FullBleedContainer';
import { getMDXComponent } from 'mdx-bundler/client';
import { bundleMDX } from 'mdx-bundler';

interface PostProps {
  postData: PostType;
  mdxSource: string;
}

interface RouteProps extends ParsedUrlQuery {
  id: string;
}

const JournalPage: React.FC<PostProps> = ({ postData, mdxSource }) => {
  const { title, date } = postData;
  const MDXComponent = React.useMemo(() => getMDXComponent(mdxSource), [
    mdxSource,
  ]);

  return (
    <>
      <SEO title={title} />
      <FullBleedContainer>
        <JournalTitle title={title} date={date} />
        <div>
          <MDXComponent />
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

  const { code: mdxSource } = await bundleMDX(
    postData.content || '_no content_ 😢'
  );

  return {
    props: {
      notFound: process.env.NODE_ENV === 'production',
      postData,
      mdxSource,
    },
  };
};

export default JournalPage;
