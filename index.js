// @ts-check
const eleventyAsciidoc = require("./lib/eleventy-asciidoc.js");
const pkg = require("./package.json");

/** @typedef {import('./lib/eleventy-asciidoc.js').EleventyAsciidocOptions} EleventyAsciidocOptions} */

module.exports = {
  /**
   * Plugin config function
   *
   * @param      {object}            eleventyConfig     The eleventy configuration object
   * @param      {EleventyAsciidocOptions}  converterOptions   Options for Asciidoctor.converter()
   */
  configFunction(eleventyConfig, converterOptions) {
    try {
      eleventyConfig.versionCheck(pkg["11ty"].compatibility);
    } catch (e) {
      console.log(
        `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`,
      );
    }

    if (converterOptions?.extension_registry !== undefined) {
      console.log(
        `WARN: 'extension_registry' doesn't work well with Asciidoctor.js v3+. Use 'configure_extension_registry'.`,
      );
    }

    eleventyConfig.addTemplateFormats(["adoc", "asciidoc", "ad"]);
    eleventyConfig.addExtension(
      ["adoc", "asciidoc", "ad"],
      eleventyAsciidoc(converterOptions),
    );
  },
};
