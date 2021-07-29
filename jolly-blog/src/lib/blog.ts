import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  content: string;
}

const postsDirectory = join(process.cwd(), '_posts');

export const getPostSlugs = () => {
  return fs.readdirSync(postsDirectory);
};

export const getPostBySlug = (slug: string): Post => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data['title'],
    content,
  };
};

export const getAllPosts = (): Post[] => {
  const slugs = getPostSlugs();
  const posts = slugs.map(slug => getPostBySlug(slug));
  return posts;
};
