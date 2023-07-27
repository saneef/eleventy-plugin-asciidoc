/* eslint camelcase: ["error", {allow: ["configure_extension_registry"]}] */

const eleventyAsciidoc = require("../../../");
const shout = require("./shout.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    configure_extension_registry(registry) {
      shout.register(registry);
    },
  });
};
