const path = require('path');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const blogPostsQuery = await graphql(`
    {
      allContentfulBlogPost {
        edges {
          node {
            title
            id
            slug
            publishDate(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  `);
  if (blogPostsQuery.errors) {
    console.error(blogPostsQuery.errors);
  }
  const blogPosts = blogPostsQuery.data.allContentfulBlogPost.edges;
  blogPosts.forEach(({ node }) => {
    console.log(node);
    createPage({
      path: 'blog/' + node.slug,
      component: path.resolve('./src/templates/post.tsx'),
      context: {
        id: node.id,
      }
    });
  });
}
