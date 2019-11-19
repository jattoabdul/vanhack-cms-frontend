import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Vanhack - Class Management System' || process.env.npm_package_name,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'Vanhack - Class Management System' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'Vanhack-CMS' },
      { hid: 'og:title', name: 'og:title', content: 'Vanhack - Class Management System' },
      { name: 'msapplication-TileColor', content: '#00559c' },
      { name: 'msapplication-TileImage', content: '/favicons/ms-icon-144x144.png' },
      { name: 'theme-color', content: '#00559c' }
    ],
    link: [
      // Fonts
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700' },
      // Favicons
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/favicons/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/favicons/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/favicons/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicons/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/favicons/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/favicons/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicons/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/favicons/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-icon-180x180.png' },
      { rel: 'apple-touch-icon', sizes: '', href: '/favicons/apple-icon-.png' },
      { rel: 'apple-touch-icon', sizes: '', href: '/favicons/apple-icon-.png' },
      { rel: 'apple-touch-icon', sizes: '', href: '/favicons/apple-icon-.png' },
      { rel: 'icon', type: 'image/png', sizes: '36x36', href: '/favicons/android-icon-36x36.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicons/android-icon-48x48.png' },
      { rel: 'icon', type: 'image/png', sizes: '72x72', href: '/favicons/android-icon-72x72.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicons/android-icon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/favicons/android-icon-144x144.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicons/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
      { rel: 'manifest', href: '/favicons/manifest.json' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#00559c' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/scss/animate.scss',
    '~/assets/scss/main.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/universal', ssr: true },
    { src: '~/plugins/mixins', ssr: true },
    { src: '~/plugins/front-only', ssr: false },
    { src: '~/plugins/request', ssr: true }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: 'https://vanhack-cms-api.herokuapp.com/api/v1/',
    proxy: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  proxy: {
    '/api/': { target: `${process.env.API_URL}/`, pathRewrite: { '^/api/': '' }, changeOrigin: true }
  },
  styleResources: {
    scss: './assets/scss/variables.scss'
  },
  router: {
    linkExactActiveClass: 'active'
  },
  /*
  ** Global Env Variables
  */
  env: {
    ApiUrl: process.env.API_URL
  },
  server: {
    port: process.env.PORT || 3600, // default: USE VANHACK-CMS PORT
    host: '0.0.0.0' // default: localhost
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
