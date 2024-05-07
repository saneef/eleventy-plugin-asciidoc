/* eslint camelcase: ["error", {allow: ["configure_extension_registry"]}] */

const eleventyAsciidoc = require("../../../");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc);
};
