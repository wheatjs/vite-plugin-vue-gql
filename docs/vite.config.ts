import path from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Prism from 'markdown-it-prism'
import Vql from 'vite-plugin-vue-gql'
import MarkdownIt from 'markdown-it'

const _markdown = new MarkdownIt()
_markdown.use(Prism)

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Vql({
      fragments: './src/fragments/**/*.gql'
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      wrapperClasses: '',
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
      },
      transforms: {
        before(code, id) {
          if (id.includes('/demos/')) {
            const frontmatterEnds = code.indexOf('---\n\n') + 4
            const header = `
<script setup>
  import Demo from './demo.vue'
</script>
<DemoContainer>
  <Demo/>
  <template #source>
    [REPLACE_ME]
  </template>
</DemoContainer>
            `
            code = code.slice(0, frontmatterEnds) + header + code.slice(frontmatterEnds)
          }
          return code
        },
        after(code, id) {
          if (id.includes('/demos/')) {
            const content = readFileSync(path.join(path.dirname(id), 'demo.vue'), 'utf-8').replace(/\r?\n?[^\r\n]*$/, '')
            code = code.replace('[REPLACE_ME]', _markdown.render(`\`\`\`html\n${content}\n\`\`\``).replaceAll('{{', '&#x7B;&#x7B;').replaceAll('}}', '&#x7D;&#x7D;'))
          }

          return code.replaceAll('{{', '&#x7B;&#x7B;').replaceAll('}}', '&#x7D;&#x7D;')
        },
      },
    }),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: id => id.endsWith('.md'),

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons({
      defaultStyle: '',
    }),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: 'prose prose-sm m-auto text-left max-w-none',
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
