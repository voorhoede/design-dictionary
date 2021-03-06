'use strict';

const markdownItForInline = require('markdown-it-for-inline');
const path = require('path');

const documentsMetaData = require('../meta-tree.json');
const generateSidebar = require('../../src/generate-sidebar.js');
const manifest = require('./public/manifest.json');
const urlMatchers = require('../../src/url-matchers.js');

const {
  chain,
  compose,
  find,
  pipe,
  prop,
  map,
  match,
} = require('sanctuary');

const getDropboxDocumentLocation = pipe([
  match(/paper\.dropbox\.com\/doc\/.+--\S{26}-(\w{21})/),
  chain(match => match.groups[0]),
  chain(urlId => find (doc => doc.id === urlId) (documentsMetaData)),
  map(compose (path.parse) (prop('location'))),
]);

module.exports = {
  title: 'Digital Design Dictionary',
  ga: ' UA-55852885-5',
  themeConfig: {
    sidebar: generateSidebar(documentsMetaData),
  },
  extendMarkdown: markdown => {
    markdown.use(markdownItForInline, 'internal-link', 'link_open', (tokens, index) => {
      const token = tokens[index];

      pipe([
        getDropboxDocumentLocation,
        map(location => {
          token.attrSet(
            'href',
            `/${path.parse(location.dir).name}/${location.name}.html`
          );
        }),
      ])
      (token.attrGet('href'));
    });

    markdown.use(markdownItForInline, 'youtube-link', 'text', (tokens, index) => {
      pipe([
        urlMatchers.getYoutubeUrlId,
        map(id => {
          tokens[index] = {
            'type': 'html_block',
            'content': `
              <youtube-embed
                id="${id}"
                type="singleVideo"
              />
            `
          };
        }),
      ])
      (tokens[index].content);
    });

    markdown.use(markdownItForInline, 'youtube-playlist-link', 'text', (tokens, index) => {
      pipe([
        urlMatchers.getYoutubePlaylistUrlId,
        map(id => {
          tokens[index] = {
            'type': 'html_block',
            'content': `
              <youtube-embed
                id="${id}"
                type="playlist"
              />
            `
          };
        }),
      ])
      (tokens[index].content);
    });
  },
  chainMarkdown (config) {
    config.plugin('add-footer')
      .use(markdown => {
        markdown.core.ruler.push('add-footer', state => {
          state.tokens.push({
            'type': 'html_block',
              'content': `
                <app-footer />
              `,
          })
          return state;
        })
      })
      .after('component')

    config.plugin('add-metadata')
      .use(markdown => {
        markdown.core.ruler.push('add-metadata', state => {
          state.tokens.unshift({
            'type': 'html_block',
            'content': `
              <metadata
                :id="$page.frontmatter.doc_id"
                :date="$page.frontmatter.last_updated_date"
                :isHomePage="Boolean($page.frontmatter.home)"
              />
            `,
          });

          return state;
        });
      })
      .before('component');
  },
  dest: './dist',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/icons/favicon-32x32.png', sizes: '32x32' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/icons/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'manifest', href: '/manifest.json', crossorigin: 'use-credentials' }],
    ['meta', { name: 'theme-color', content: manifest.theme_color }],
  ],
  plugins: [
    ['@vuepress/google-analytics', {
      'ga': 'UA-55852885-5'
    }],
    [
      '@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: false,
    }]
  ],
  evergreen: true,
};
