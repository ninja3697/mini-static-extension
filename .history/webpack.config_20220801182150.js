const webpack = require('webpack');
const path = require('path');

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const copyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const sourceMapEnabled = true;
  const mode = argv.mode === 'production' ? 'production' : 'development';

  const apps = {
    name: 'webapp',
    target: 'web',
    mode,
    devtool: sourceMapEnabled && 'source-map',
    cache: true,
    externals: {
      jsdom: {},
      acorn: {},
    },
    output: {
      path: path.join(__dirname, './dist'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    entry: {
      index: path.resolve(__dirname, 'src', './ui/webapp.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            '@linaria/webpack5-loader',
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(__dirname, './tsconfig.webapp.json'),
              },
            },
          ],
        },
        {
          test: /\.(s(a|c)ss|css)$/,
          use: [
            'style-loader',
            // MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                // sourceMap: true,
                modules: {
                  auto: true,
                  localIdentName: '[hash:base64:8]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: 'url-loader',
          },
        },
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      alias: {
        ['solid-js']: path.resolve(path.join('./node_modules/', 'solid-js')),
      },
      fallback: {
        fs: false,
        path: false,
      },
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      historyApiFallback: true,
      hot: false,
    },
  };

  const codeWebFiles = {
    name: 'vsc-web',
    mode,
    target: ['web', 'es6'], // vscode extensions run in webworker context for VS Code web ???? -> https://webpack.js.org/configuration/target/#target
    devtool: sourceMapEnabled && 'source-map',
    entry: {
      renderCollection: path.resolve(__dirname, 'src', './vsc/renderCollection.tsx'),
    },
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), ???? -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'dist-vsc'),
      filename: '[name].js',
      clean: true,
      publicPath: '/',
      // devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    externals: {
      vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, ???? -> https://webpack.js.org/configuration/externals/
    },
    resolve: apps.resolve,
    module: apps.module,
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  };

  const codeExtension = {
    name: 'vsc',
    dependencies: ['vsc-web'],
    mode,
    target: 'node', // vscode extensions run in webworker context for VS Code web ???? -> https://webpack.js.org/configuration/target/#target
    devtool: sourceMapEnabled && 'source-map',
    entry: {
      main: path.resolve(__dirname, 'src', 'vsc/extension.ts'), // the entry point of this extension, ???? -> https://webpack.js.org/configuration/entry-context/
    },
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), ???? -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'dist-vsc'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      publicPath: '/',
      // devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    externals: {
      vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, ???? -> https://webpack.js.org/configuration/externals/
      canvas: {},
      jsdom: {},
    },
    resolve: {
      // support reading TypeScript and JavaScript files, ???? -> https://github.com/TypeStrong/ts-loader
      mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)s?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                retainLines: true,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(__dirname, './tsconfig.vsc.json'),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new copyPlugin({
        patterns: [
          { from: '.', to: '.', context: 'public/icons' },
          { from: '.', to: '.', context: 'public/vsc' },
        ],
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  };

  if (env.only === 'webapp') {
    return apps;
  } else if (env.only === 'figma') {
    return figmaPlugin;
  } else {
    return [apps, figmaPlugin, codeWebFiles, codeExtension];
  }
};
