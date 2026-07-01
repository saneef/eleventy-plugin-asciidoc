/* eslint camelcase: ["error", {allow: ["extension_registry"]}] */

import eleventyAsciidoc from "../../../index.js";
import { Extensions } from "@asciidoctor/core";

const registry = Extensions.create();
registry.block(function () {
  const self = this;
  self.named("shout");
  self.onContext("paragraph");
  self.process(function (parent, reader) {
    const lines = reader.getLines().map(function (l) {
      return l.toUpperCase();
    });
    return self.createBlock(parent, "paragraph", lines);
  });
});

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    extension_registry: registry,
  });
}
