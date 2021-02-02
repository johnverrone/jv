const path = require('path');

const query = {
  posts: `{
    allContentfulBlogPost {
      edges {
        node {
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
    }
  }`,
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const blogPostsQuery = await graphql(query.posts);

  if (blogPostsQuery.errors) {
    console.error(blogPostsQuery.errors);
  }
  const blogPosts = blogPostsQuery.data.allContentfulBlogPost.edges;
  blogPosts.forEach(({ node }) => {
    createPage({
      path: 'blog/' + node.slug,
      component: path.resolve('./src/templates/post.tsx'),
      context: {
        ...node,
      },
    });
  });
};
