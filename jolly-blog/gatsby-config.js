module.exports = {
  siteMetadata: {
    title: `John and Molly`,
    description: `Jolly's adventure blog`,
    author: `@johnverrone, @mollydickinson`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-emotion`,
    `gatsby-background-image`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-plugin-fullstory`,
      options: {
        fs_org: process.env.FS_ORG_ID,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Open Sans`, `Cairo`],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-source-notion-api`,
      options: {
        token: process.env.NOTION_TOKEN,
        databaseId: process.env.NOTION_DATABASE,
        propsToFrontmatter: true,
        lowerTitleLevel: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `John and Molly`,
        short_name: `Jolly`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#FFFFFF`,
        display: `standalone`,
        icon: `./static/images/favicon.png`,
      },
    },
    // `gatsby-plugin-offline`,
  ],
};
