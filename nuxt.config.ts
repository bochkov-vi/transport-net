// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-lodash',
    'pinia-plugin-persistedstate'
  ],
  ssr:false,
  quasar: {
    sassVariables: true,
    plugins: ['Dialog', 'Notify', 'Dark'],
    lang: 'ru',
    iconSet: 'mdi-v7',
    extras: {
      font: 'roboto-font'
    },
    config: {
      dark: false
    },
    components: {
      defaults: {
        QBtn: {
          dense: true
        },
        QList: {
          dense: true
        },
        QRadio: {
          dense: true
        },
        QCheckbox: {
          dense: true
        },
        QItem: {
          dense: true
        },
        QExpansionItem: {
          dense: true
        },
        QInput: {
          dense: true
        }
      }
    }
  }, i18n: {
    vueI18n: './i18n/config.ts'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/css/app.scss";'
        }
      }
    }
  }
});
