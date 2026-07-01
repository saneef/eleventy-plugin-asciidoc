// @ts-check
import eleventyAsciidoc from "./lib/eleventy-asciidoc.js";

/** @typedef {import('./lib/eleventy-asciidoc.js').EleventyAsciidocOptions} EleventyAsciidocOptions} */

/**
 * Plugin config function
 *
 * @param      {object}            eleventyConfig     The eleventy configuration object
 * @param      {EleventyAsciidocOptions}  converterOptions   Options for Asciidoctor.converter()
 */
export default function config(eleventyConfig, converterOptions) {
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
}
