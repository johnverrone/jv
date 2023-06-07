import { AppContainer } from '@components/AppContainer';
import { ComingSoon } from '@components/ComingSoon';
import { WheelNav } from '@components/Navigation';
import { SEO } from '@components/SEO';
import { GetStaticProps } from 'next';

interface BlogPageProps {
  posts: { slug: string; title: string }[];
}

const BlogPage = ({ posts }: BlogPageProps) => {
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
        <ComingSoon />
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
