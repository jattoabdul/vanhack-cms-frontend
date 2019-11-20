module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs'
  ],
  // add your custom rules here
  rules: {
    'no-irregular-whitespace': 0,
    'no-prototype-builtins': 0,
    'arrow-parens': 0,
    'vue/no-v-html': 0,
    'camelcase': 0,
    'dot-notation': 1,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
