const path = require('path');

const query = {
  posts: `{
    allNotion {
      edges {
        node {
          id
          title
          properties {
            Date {
              value {
                start(formatString: "MMMM DD, YYYY")
              }
            }
          }
          childMarkdownRemark {
            html
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

  const blogPosts = blogPostsQuery.data.allNotion.edges;
  blogPosts.forEach(({ node }) => {
    createPage({
      path: 'blog/' + node.id,
      component: path.resolve('./src/templates/post.tsx'),
      context: {
        ...node,
      },
    });
  });
};
