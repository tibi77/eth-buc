/* eslint-disable @typescript-eslint/no-require-imports */
const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
    .swcOptions;
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isWatchMode = process.argv.includes('--watch');
const nodeEnv =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  externalsPresets: { node: true },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
  mode: nodeEnv,
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [{ from: './src/emails/*.html', to: './emails/*.html' }],
    // }),
    new webpack.HotModuleReplacementPlugin(),
    // disable this for build
    ...(isWatchMode
      ? [
          new RunScriptWebpackPlugin({
            name: 'main.js',
            // setting this to false will enable HMR, for now we keep HMR disabled because it
            // doesn't work well with the swagger plugin
            autoRestart: true,
            nodeArgs: ['--inspect'],
          }),
        ]
      : []),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
};
