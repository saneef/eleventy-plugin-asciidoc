const eleventyAsciidoc = require("./lib/eleventy-asciidoc.js");

/** @typedef {import('./lib/eleventy-asciidoc.js').ProcessorOptions} ProcessorOptions} */

module.exports = {
  /**
   * Plugin config function
   *
   * @param      {object}            eleventyConfig     The eleventy configuration object
   * @param      {ProcessorOptions}  converterOptions   Options for Asciidoctor.converter()
   */
  configFunction(eleventyConfig, converterOptions) {
    eleventyConfig.addTemplateFormats("adoc");
    eleventyConfig.addExtension("adoc", eleventyAsciidoc(converterOptions));
  },
};
