const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parsedPath = path.parse(item);
    const name = parsedPath.name;
    const extension = parsedPath.ext.substring(1);
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: "body",
      scriptLoading: "defer",
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
    clean: true,
    assetModuleFilename: "assets/[name][ext]",
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  devtool: "source-map",
  mode: "production",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    hot: true,
    open: true,
    watchFiles: ["src/**/*"],
  },
  performance: {
    maxEntrypointSize: 2621440,
    maxAssetSize: 1572864,
  },
  optimization: {
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
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    runtimeChunk: "single",
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
            options: {
              implementation: require("sass"),
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "node_modules/lightgallery"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "img/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(ico|pdf)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "node_modules/lightgallery/fonts", to: "fonts" },
        { from: "node_modules/lightgallery/images", to: "images" },
        { from: "node_modules/katex/dist/fonts", to: "katex/fonts" },
        { from: "src/fonts", to: "fonts", noErrorOnMissing: true },
        { from: "src/favicon", to: "favicon", noErrorOnMissing: true },
        { from: "src/img", to: "img", noErrorOnMissing: true },
        { from: "src/uploads", to: "uploads", noErrorOnMissing: true },
      ],
    }),
  ].concat(htmlPlugins),
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.output.filename = "./js/[name].js";
    config.output.assetModuleFilename = "assets/[name][ext]";
    config.optimization.moduleIds = "named";
    config.optimization.chunkIds = "named";
  } else {
    config.devtool = "eval-source-map";
    config.optimization.minimize = false;
    config.output.filename = "./js/[name].js";
    config.output.assetModuleFilename = "assets/[name][ext]";
    config.optimization.splitChunks = false;
    config.optimization.runtimeChunk = false;
  }

  return config;
};
