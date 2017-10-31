const webpack = require('webpack');
const path = require('path');
const rootDir = process.cwd();

module.exports = {
  entry: path.resolve(rootDir, 'test/e2e/e2e.browser.ts'),
  target: 'node',
  resolve: { extensions: ['.js', '.ts'] },
  output: {
    path: path.resolve(rootDir, 'test/e2e/dist'),
    filename: '[name].js'
  },

  // todo: remove this if causing any problems
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
    exprContextCritical: false
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      __dirname
    ),
  ]
};
