const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/js/index.js',
    './src/scss/style.scss'
  ],
  output: {
    filename: './js/bundle.js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader?presets=env'
        }
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: ['css-loader?url=false', 'sass-loader']
        })
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/templates'),
        loader: 'raw-loader',
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: './index.html',
      title: 'My Awesome application',
      inject: false,
    }),
    /*new CopyWebpackPlugin([{
        from: './node_modules/lightgallery/src/img',
        to: './img'
      },
      {
        from: './node_modules/lightgallery/src/fonts',
        to: './fonts'
      },
      {
        from: './src/fonts',
        to: './fonts'
      },
      {
        from: './src/favicon',
        to: './favicon'
      },
      {
        from: './src/img',
        to: './img'
      },
      {
        from: './src/uploads',
        to: './uploads'
      }
    ]),*/
  ],
};