const path = require("path");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env) => ({
  mode: env.NODE_ENV,
  watch: env.NODE_ENV === "development",
  entry: {
    app: path.join(__dirname, "src", "index.tsx"),
  },
  output: {
    libraryTarget: "umd",
    library: "Onramper",
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
        options: {
          configFile: path.resolve(__dirname, "tsconfig.json"),
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName:
                  env.NODE_ENV === "development"
                    ? "[local]__[hash:base64:5]"
                    : "[hash:base64:5]",
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
            },
          },
          {
            loader: "svg-url-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.STAGE": JSON.stringify(env.STAGE),
    }),
    new ESLintPlugin({
      extensions: ["ts", "tsx"],
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM",
    },
  },
});
