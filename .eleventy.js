const eleventyAsciidoc = require("./lib/eleventy-asciidoc.js");

module.exports = {
  /**
   * Plugin config function
   *
   * @param      {Object}  eleventy     The eleventy configuration object
   */
  configFunction(eleventyConfig, userOptions) {
    eleventyConfig.addTemplateFormats("adoc");
    eleventyConfig.addExtension("adoc", eleventyAsciidoc(userOptions));
  },
};
