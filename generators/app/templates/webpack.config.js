const path = require("path");
const webpack = require("webpack");

//Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("@nenado/watch-missing-node-modules-plugin");

const config = env => {
  const srcPath = path.resolve(__dirname, "src");
  
  const typescriptLoaderRule = {
    test: /\.(ts|tsx)$/,
    include: [srcPath],
    use: {
      loader: "ts-loader",
      options: {
        //Type checking is handled by ForkTsChecker
        transpileOnly: true,
        //Build paralelization
        happyPackMode: true
      }
    },
  };
  
  //React and styled components transpiling
  const babelLoaderRule = {
    test: /\.(mjs|js)$/,
    include: [srcPath],
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-react"
        ],
        plugins: [
          "babel-plugin-styled-components"
        ],
        cacheDirectory: true,
        //Gzipping cache
        compact: env.NODE_ENV === "production"
      }
    }
  };

  //Importing CSS
  const cssLoaderRule = {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"]
  };

  //Importing assets
  const fileLoaderRule = {
    test: /\.(png|jpe?g|gif|mp3|svg|woff|woff2|eot|ttf|otf|mp4)$/i,
    type: "asset/resource"
  };

  return {
    mode: env.NODE_ENV,
    //Stops compilation on the first error
    bail: env.NODE_ENV === "production",
    devtool: env.NODE_ENV === "development" ? "eval-cheap-module-source-map" : "source-map",
    entry: {
      index: "./src/index.tsx",
    },
    output: {
      path: path.resolve(__dirname, "public"),
      filename: env.NODE_ENV === "development" ? "[name].js" : "[fullhash].[name].js",
      pathinfo: false,
      assetModuleFilename: "assets/[name].[ext]",
      //So that every resource will be served as if the URL was "/" (client side routing)
      publicPath: "/"
    },
    module: {
      strictExportPresence: true,
      rules: [
        typescriptLoaderRule,
        babelLoaderRule,
        cssLoaderRule,
        fileLoaderRule
      ]
    },
    resolve: {
      //Only tries to resolve modules with these extensions
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      //Doesn't resolve symlinks to actual location (improves build performance)
      symlinks: false,
      //Allows us to reference files (when importing) without specifying 
      //their extensions (.js, .ts, etc)
      enforceExtension: false,
      //Not sure what this does, so be aware (but should improve build performance)
      cacheWithContext: false
    },
    plugins: [
      new webpack.DefinePlugin({
        "NODE_ENV": env
      }),
      new ForkTsCheckerWebpackPlugin({
        async: env.NODE_ENV === "development",
        typescript: {
          checkSyntacticErrors: true,
          tsconfig: "./tsconfig.json"
        }
      }),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "Title",
        filename: "index.html",
        meta: { viewport: "width=device-width, initial-scale=1, user-scalable=no" },
        chunks: ["index"]
      })
    ],
    optimization: {
      minimize: env.NODE_ENV === "production",
      mergeDuplicateChunks: true,
      removeEmptyChunks: env.NODE_ENV === "production",
      removeAvailableModules: env.NODE_ENV === "production",
      splitChunks: {
        chunks: "all",
        //Test this
        name: false
      }
    },
    devServer: {
      contentBase: "./public",
      //Gzip compression for everything
      compress: true,
      liveReload: true,
      //Opens browser automatically
      open: true,
      //Shows warnings/errors as overlay on the web page
      overlay: true,
      //Serves index.html to every route (client side routing)
      historyApiFallback: true
    },
  };
}



module.exports = [config];
