const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const cssnano  = require( 'cssnano');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
  entry: {
    'app': [
      './src/js/index.js',
      './src/scss/style.scss'
    ],
    '../katex/katex': [
      './src/js/katex.js',
      './src/scss/katex.scss'
    ]
  },
  output: { filename: './js/[name].js' },
  module: {
    rules: [{
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                cssnano({
                  preset: ['default', {
                      discardComments: {
                          removeAll: true,
                      },
                  }]
              })
              ]
             }
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    }),
    new CopyWebpackPlugin([
      { from: './node_modules/lightgallery.js/src/img', to: './img' },
      { from: './node_modules/lightgallery.js/src/fonts', to: './fonts' },
      { from: './node_modules/katex/dist/fonts', to: './katex/fonts' },
      { from: './src/fonts', to: './fonts' },
      { from: './src/favicon', to: './favicon' },
      { from: './src/img', to: './img' },
      { from: './src/uploads', to: './uploads' }
    ]),
  ].concat(htmlPlugins)
};