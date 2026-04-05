const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { Eta } = require("eta");

function generateHtmlPlugins(templateDir) {
  const includesDir = path.resolve(__dirname, "src/html/includes");
  const eta = new Eta({
    // useWith: lodash-style `<%= title %>` without `it.` in includes/
    useWith: true,
    // XSS-safe default: `<%=` is HTML-escaped. Trusted HTML from partials: `<%~ ... %>`.
    autoEscape: true,
  });
  const includeCache = new Map();
  function include(fileName, data) {
    const fullPath = path.resolve(includesDir, fileName);
    let src = includeCache.get(fullPath);
    if (!src) {
      src = fs.readFileSync(fullPath, "utf8");
      includeCache.set(fullPath, src);
    }
    return eta.renderString(src, { ...data, include });
  }

  const templateFiles = fs
    .readdirSync(path.resolve(__dirname, templateDir))
    .filter((item) => path.parse(item).ext.toLowerCase() === ".html");
  const baseChunks = ["app", "katex/katex", "mermaid/mermaid", "charts/charts"];
  return templateFiles.map((item) => {
    const parsedPath = path.parse(item);
    const name = parsedPath.name;
    const extension = parsedPath.ext.substring(1);
    const chunks = name === "index" ? [...baseChunks, "stl-viewer/stl-viewer"] : baseChunks;
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: "body",
      scriptLoading: "defer",
      templateParameters: (compilation, assets, assetTags, options) => ({
        compilation,
        webpackConfig: compilation.options,
        htmlWebpackPlugin: { tags: assetTags, files: assets, options },
        include,
      }),
      chunks,
    });
  });
}

function createCopyPatterns() {
  return [
    { from: "node_modules/lightgallery/fonts", to: "fonts" },
    { from: "node_modules/lightgallery/images", to: "images" },
    { from: "node_modules/katex/dist/fonts", to: "katex/fonts" },
    { from: "src/fonts", to: "fonts", noErrorOnMissing: true },
    { from: "src/favicon", to: "favicon", noErrorOnMissing: true },
    { from: "src/img", to: "img", noErrorOnMissing: true },
    { from: "src/uploads", to: "uploads", noErrorOnMissing: true },
  ];
}

function createMinimizers() {
  return [
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
  ];
}

function createPlugins() {
  return [
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => {
        const name = chunk?.name;
        if (!name || name === "early") return "css/[name].css";
        return `css/${name}.css`;
      },
    }),
    new CopyPlugin({
      patterns: createCopyPatterns(),
    }),
    ...generateHtmlPlugins("src/html/views"),
  ];
}

function createWebpackConfig(env, argv) {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      early: ["./src/js/early.js"],
      app: ["./src/js/index.js", "./src/scss/style.scss"],
      "katex/katex": ["./src/js/katex.js", "./src/scss/katex.scss"],
      "stl-viewer/stl-viewer": ["./src/js/stl-viewer.js", "./src/scss/stl-viewer.scss"],
      "mermaid/mermaid": ["./src/js/mermaid.js"],
      "charts/charts": ["./src/js/charts.js", "./src/scss/charts.scss"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: (pathData) => {
        const name = pathData.chunk.name;
        if (name === "early") return "./js/early.js";
        return `./js/${name}.js`;
      },
      chunkFilename: "./js/chunks/[name].js",
      clean: true,
      assetModuleFilename: "assets/[name][ext]",
    },
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
    devtool: isProduction ? false : "eval-source-map",
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
      // Increase thresholds to avoid warnings for large bundles (e.g., charts entrypoint).
      maxEntrypointSize: 5242880,
      maxAssetSize: 5242880,
    },
    optimization: {
      minimize: isProduction,
      minimizer: createMinimizers(),
      splitChunks: false,
      runtimeChunk: false,
      ...(isProduction ? { moduleIds: "named", chunkIds: "named" } : {}),
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
                // Resolve file url(...) in SCSS/CSS; data: URLs (e.g. Bootstrap icons) pass through.
                url: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sassOptions: {
                  loadPaths: [path.resolve(__dirname, "node_modules")],
                  quietDeps: true,
                  silenceDeprecations: ["import", "global-builtin", "legacy-js-api", "if-function"],
                },
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
                url: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, "node_modules/katex"),
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                url: true,
              },
            },
          ],
        },
        {
          test: /\.html$/,
          include: path.resolve(__dirname, "src/html/includes"),
          type: "asset/source",
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
    plugins: createPlugins(),
  };
}

module.exports = (env, argv) => createWebpackConfig(env, argv);
