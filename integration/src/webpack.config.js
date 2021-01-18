const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    './node_modules/core-js/client/shim.min.js',
    './node_modules/zone.js/dist/zone.min.js',
    path.join('../out-tsc/e2e', 'postrender.js'),
  ],
  output: {
    path: path.resolve('dist'),
    filename: 'postrender.js'
  },

  resolve: {
    symlinks: true
  },

  // todo: remove this if causing any problems
  module: {
    exprContextCritical: false
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      __dirname
    ),
  ]
};
