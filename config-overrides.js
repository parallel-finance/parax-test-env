const path = require('path');

const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const {
  override,
  addBabelPlugin,
  addWebpackModuleRule,
  addWebpackAlias,
  addWebpackPlugin,
  setWebpackStats
} = require('customize-cra');

module.exports = {
  webpack: config => {
    return override(
      addBabelPlugin([
        'babel-plugin-styled-components',
        {
          displayName: true
          // any extra config from babel-plugin-styled-components
        }
      ]),
      addWebpackModuleRule({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }),
      addWebpackModuleRule({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader')
      }),
      addWebpackModuleRule({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }),
      addWebpackAlias({
        '@': path.resolve(__dirname, 'src')
      }),
      addWebpackPlugin(
        new NodePolyfillPlugin({
          excludeAliases: ['console']
        })
      ),
      setWebpackStats('errors-only')
    )({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false,
          os: false,
          path: false
        }
      },
      devServer: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
      },
      ignoreWarnings: [/Failed to parse source map/]
    });
  },

  jest: config => {
    config.transformIgnorePatterns = [
      '/node_modules/(?!(@parallel-mono/components|@babel)).+\\.js$'
    ];

    return config;
  }
};
