const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const env = process.env.MIX_ENV === 'prod' ? 'production' : 'development';

const plugins = {
  production: [
    // Only run in production. Produce minified JS.
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true
      },
      sourceMap: true
    })
  ],
  development: []
};

module.exports = {
  devServer: {
    contentBase: './priv/static'
  },
  output: {
    path: path.join(__dirname, '../priv/static'),
    filename: 'js/app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg|pdf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: 'assets/',
              outputPath: 'assets'
            },
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(__dirname, 'priv/static')
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    }),
    new FlowBabelWebpackPlugin(),
    new CopyWebpackPlugin([
      { 
        from: path.join(__dirname, 'static')
      }
    ])
  ].concat(plugins[env]),
  resolve: {
    modules: [
      'node_modules',
      'assets/js'
    ],
    extensions: ['.js', '.json'],
    alias: {
      phoenix: path.join(__dirname, '/deps/phoenix/priv/static/phoenix.js'),
      phoenix_html: path.join(__dirname, '/deps/phoenix_html/priv/static/phoenix_html.js')
    }
  }
};