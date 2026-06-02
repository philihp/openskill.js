import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'openskill.js',
  description:
    'A faster, open-source alternative to TrueSkill. A Javascript/TypeScript implementation of Weng-Lin Bayesian rating.',
  lang: 'en-US',

  // Deployed as a GitHub Pages project site at
  // https://philihp.github.io/openskill.js/
  base: '/openskill.js/',

  lastUpdated: true,
  cleanUrls: true,

  head: [['link', { rel: 'icon', href: '/openskill.js/favicon.svg', type: 'image/svg+xml' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/options' },
      {
        text: 'v5.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/philihp/openskill.js/blob/main/CHANGELOG.md' },
          { text: 'npm', link: 'https://www.npmjs.com/package/openskill' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Ratings & Ordinal', link: '/guide/ratings' },
            { text: 'Recording Matches', link: '/guide/rating-matches' },
            { text: 'Predictions', link: '/guide/predictions' },
          ],
        },
        {
          text: 'Models',
          items: [
            { text: 'Choosing a Model', link: '/guide/models' },
            { text: 'Custom Models', link: '/guide/custom-models' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Options', link: '/reference/options' },
            { text: 'API', link: '/reference/api' },
            { text: 'Types', link: '/reference/types' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/philihp/openskill.js' }],

    editLink: {
      pattern: 'https://github.com/philihp/openskill.js/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Philihp Busby',
    },
  },
})
