const webpack = require('webpack');
const path = require('path');
const rootDir = process.cwd();
const outDir = path.resolve(rootDir, 'out-tsc/e2e/');

module.exports = {
  entry: path.resolve(outDir, 'postrender.js'),
  output: {
    path: path.resolve(rootDir, 'dist'),
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
