// @ts-check

const asciidoctor = require("asciidoctor").default();
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");
const nunjucks = require("nunjucks");

/** @typedef {import('asciidoctor').Asciidoctor.ProcessorOptions} ProcessorOptions} */

/**
 * Generates Eleventy template renderer for AsciiDoctor
 *
 * @param      {ProcessorOptions=}  options options for Asciidoctor.converter()
 * @return     {Object}  { description_of_the_return_value }
 */
function eleventyAsciidoctor(options = {}) {
  debug("Options: ", options);
  const readFileSync = (inputPath) => {
    return matter(fs.readFileSync(inputPath, "utf8"));
  };

  const getData = (inputPath) => {
    const { data } = readFileSync(inputPath);

    return data;
  };

  const compile = (str) => (data) => {
    if (str) {
      // Since `read: false` is set 11ty doesn't read file contents
      // so if str has a value, it's a permalink (which can be a string or a function)
      return typeof str === "function"
        ? str(data)
        : nunjucks.renderString(str, data);
    }

    debug(`Reading ${data.page.inputPath}`);
    const { content } = readFileSync(data.page.inputPath);

    if (content) {
      debug(`Converting:\n ${content}`);
      return asciidoctor.convert(content, options);
    }
  };

  return {
    read: false,
    getData,
    compile,
  };
}

module.exports = eleventyAsciidoctor;
