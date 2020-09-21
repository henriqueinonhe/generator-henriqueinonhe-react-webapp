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
    this.npmInstall();
  }
};