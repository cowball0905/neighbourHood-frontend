// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  piniaPersistedstate: {
    storage: 'localStorage'
  },
  i18n: {
    langDir: 'locale',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh.json',
        name: '中文'
      }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix'
  },
  css: [
    '@/assets/css/global.css'
  ],
  ssr: false,
  devServer: {
    port: 3000
  },
  runtimeConfig:{
    public:{
      apiBase: ""
    }
  }
})
