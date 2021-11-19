import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { GetStaticProps } from 'next';
import { WheelNav } from '@components/Navigation';

interface BlogPageProps {
  posts: { slug: string; title: string }[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <SEO title="Blog" />
      <WheelNav />
      <AppContainer>
        {/* {posts.map(p => (
          <Link href={`/blog/${p.slug}`} key={p.slug}>
            <a>
              <h1>{p.title}</h1>
            </a>
          </Link>
        ))} */}
        <p>🚧 coming soon 🚧</p>
      </AppContainer>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const posts = [{ slug: '1', title: 'blog 1' }];

  return {
    props: {
      posts,
    },
  };
};

export default BlogPage;
