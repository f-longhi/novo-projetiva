const {resolve} = require('path');

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, 'src/main.mjs'),
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
}
