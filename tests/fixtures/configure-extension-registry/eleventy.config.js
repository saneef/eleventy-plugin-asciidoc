/* eslint camelcase: ["error", {allow: ["configure_extension_registry"]}] */

import eleventyAsciidoc from "../../../index.js";
import { register } from "./shout.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    configure_extension_registry(registry) {
      register(registry);
    },
  });
}
