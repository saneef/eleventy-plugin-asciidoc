// @ts-check
const eleventyAsciidoc = require("./lib/eleventy-asciidoc.js");
const pkg = require("./package.json");

/** @typedef {import('./lib/eleventy-asciidoc.js').ProcessorOptions} ProcessorOptions} */

module.exports = {
  /**
   * Plugin config function
   *
   * @param      {object}            eleventyConfig     The eleventy configuration object
   * @param      {ProcessorOptions}  converterOptions   Options for Asciidoctor.converter()
   */
  configFunction(eleventyConfig, converterOptions) {
    try {
      eleventyConfig.versionCheck(pkg["11ty"].compatibility);
    } catch (e) {
      console.log(
        `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`,
      );
    }

    eleventyConfig.addTemplateFormats("adoc");
    eleventyConfig.addExtension("adoc", eleventyAsciidoc(converterOptions));
  },
};
