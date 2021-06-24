import React from 'react';
import BlogList from '../components/BlogList';
import Layout from '../components/Layout';
import { Client } from '@notionhq/client';

export default function BlogPage({ posts }) {
  return (
    <Layout title="blog">
      <BlogList posts={posts} />
    </Layout>
  );
}

export async function getStaticProps() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE;

  async function getJournals() {
    try {
      const journals = await notion.request({
        path: `databases/${databaseId}/query`,
        method: 'post',
        body: {},
      });
      console.log('Success!', journals);
      return journals;
    } catch (error) {
      console.log(error.body);
    }
  }

  const posts = await getJournals();
  return {
    props: { posts },
  };
}
