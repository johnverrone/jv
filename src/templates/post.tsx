import React from 'react';
import { graphql } from 'gatsby';

const Post = ({ data }) => {
  const { contentfulBlogPost } = data;
  const { title, publishDate, body} = contentfulBlogPost;
  const html = body.childMarkdownRemark.html;

  return (
    <div className="post">
      <h1>{title}</h1>
      <h2>{publishDate}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Post;
export const pageQuery = graphql`
  query BlogPostQuery($id: String!) {
    contentfulBlogPost(id: { eq: $id }) {
      title
      id
      slug
      publishDate(formatString: "MMMM DD, YYYY")
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;
