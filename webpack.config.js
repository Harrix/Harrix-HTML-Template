const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins("src/html/views");

const config = {
  entry: {
    app: ["./src/js/index.js", "./src/scss/style.scss"],
    "../katex/katex": ["./src/js/katex.js", "./src/scss/katex.scss"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "node_modules/lightgallery.js/src/img", to: "img" },
        { from: "node_modules/lightgallery.js/src/fonts", to: "fonts" },
        { from: "node_modules/katex/dist/fonts", to: "katex/fonts" },
        { from: "src/fonts", to: "fonts" },
        { from: "src/favicon", to: "favicon" },
        { from: "src/img", to: "img" },
        { from: "src/uploads", to: "uploads" },
      ],
    }),
  ].concat(htmlPlugins),
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }
  if (argv.mode === "production") {
    config.devtool = "source-map";
    config.optimization = {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
        new TerserPlugin({
          extractComments: true,
        }),
      ],
    };
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
