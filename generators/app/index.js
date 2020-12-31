var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
  }

  writing() {
    if(this.fs.exists(this.destinationPath("package.json"))) {
      this.env.error("There cannot be an existing \"package.json\"! (Let the generator handle it!)");
      return;
    }

    this.fs.copy(this.templatePath("**"),
                 this.destinationRoot(),
                 { globOptions: {dot: true}});
  }

  install() {
    //Dependencies
    this.npmInstall([
      "react",
      "react-dom",
      "styled-components"
    ]);

    //Dev Dependencies
    this.npmInstall([
      //Webpack
      "webpack",
      "webpack-cli",
      //Webpack Plugins
      "webpack-node-externals",
      "html-webpack-plugin",
      "clean-webpack-plugin",
      "fork-ts-checker-webpack-plugin",
      "case-sensitive-paths-webpack-plugin",
      "@nenado/watch-missing-node-modules-plugin",
      //Webpack Loaders
      "ts-loader",
      "babel-loader",
      "css-loader",
      "style-loader",
      //Typescript
      "typescript",
      "typedoc",
      //Jest
      "jest",
      "ts-jest",
      "jest-puppeteer",
      "expect-puppeteer",
      //Eslint
      "eslint",
      "eslint-plugin-react",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      //Babel
      "@babel/core",
      "@babel/preset-env",
      "@babel/preset-react",
      //Types (for typescript)
      "@types/jest",
      "@types/jest-environment-puppeteer",
      "@types/node",
      "@types/puppeteer",
      "@types/react",
      "@types/react-dom",
      "@types/styled-components",
      //Other
      "dotenv"
    ], {
      "save-dev": true
    });
  }
};