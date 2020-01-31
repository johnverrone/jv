module.exports = {
  siteMetadata: {
    title: `John Verrone`,
    description: `Software Engineer at FullStory. Photo/Video hobbyist.`,
    author: `@johnverrone`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-scss-typescript`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Open Sans`],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-background-image`,
      options: {

      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_TOKEN,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `John Verrone`,
        short_name: `JV`,
        start_url: `/`,
        background_color: `#222222`,
        theme_color: `#EEEEEEE`,
        display: `standalone`,
        icon: `src/images/favicon.png`,
      }
    }
    // `gatsby-plugin-offline`,
  ],
};
