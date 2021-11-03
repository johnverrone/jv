import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  author?: string;
  published: boolean;
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

  try {
    const dateString = data['date'];
    const date = new Date(
      dateString.substring(6),
      Number.parseInt(dateString.substring(0, 2) + 1)
    );

    const published = Boolean(data['published']) ?? false;

    if (date.toString() === 'Invalid Date') throw new Error('Invalid date');

    return {
      slug: realSlug,
      title: data['title'],
      date: dateString,
      published,
      content,
    };
  } catch (e) {
    console.log('Errored getting post');
    throw e;
  }
};

export const getAllPosts = (): Post[] => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(p => (process.env.NODE_ENV === 'production' ? p.published : p)); // only filter published blogs for production
  return posts;
};
