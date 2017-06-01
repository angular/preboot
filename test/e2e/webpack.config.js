const webpack = require('webpack');
const path = require('path');
const rootDir = process.cwd();

module.exports = {
  entry: path.resolve(rootDir, 'test/e2e/e2e.browser.js'),
  output: {
    path: path.resolve(rootDir, 'test/e2e/dist'),
    filename: 'e2e.browser.js'
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
