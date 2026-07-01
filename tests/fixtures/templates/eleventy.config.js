/* eslint camelcase: ["error", {allow: ["template_dir"]}] */

import { fileURLToPath } from "url";
import { dirname } from "path";
import eleventyAsciidoc from "../../../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    template_dir: `${__dirname}/asciidoc-templates`,
  });
}
