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
  if (converterOptions?.configure_extension_registry !== undefined) {
    console.log(
      `[DEPRECATED]: 'configure_extension_registry' is deprecated will be removed in a future release.
From eleventy-plugin-asciidoc v6.1.0 (with Asciidoctor.js 4.0), the native 'extension_registry' works as intended.`,
    );
  }

  eleventyConfig.addTemplateFormats(["adoc", "asciidoc", "ad"]);
  eleventyConfig.addExtension(
    ["adoc", "asciidoc", "ad"],
    eleventyAsciidoc(converterOptions),
  );
}
