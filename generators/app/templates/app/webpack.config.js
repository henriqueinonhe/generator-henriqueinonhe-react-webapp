const path = require("path");
const nodeExternals = require("webpack-node-externals");

const config = type => env => ({
  mode: env.NODE_ENV,
  entry: type === "frontend" ? "./frontend/src/Components/App.tsx" : "./backend/src/index.ts",
  output: type === "frontend" ? {
    path: path.resolve(__dirname, "./frontend/public"),
    filename: "bundle.js"
  } : 
  {
    path: path.resolve(__dirname, "./backend"),
    filename: "index.js"
  },
  target: type === "frontend" ? "web" : "node",
  externals: type === "frontend" ? [] : [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            //transpileOnly: true
          }
        },
        include: /src/
      },
      {
        test: /\.m?js$/,
        include: [path.resolve(__dirname, "./backend/src"), path.resolve(__dirname, "./core/src"), path.resolve(__dirname, "./frontend/src")],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react"
            ],
            plugins: [
              "babel-plugin-styled-components"
            ],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets"
            }
          }
        ]
      }
    ]
  },
  devtool: env.NODE_ENV === "development" ? "source-map" : "none",
  resolve: {
    extensions: [".ts", ".js", ".json", ".tsx"],
    symlinks: false
  }
});

module.exports = [config("frontend"), config("backend")];