// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir"]}] */

const asciidoctor = require("asciidoctor").default();
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");
const nunjucks = require("nunjucks");

/** @typedef {import('asciidoctor').Asciidoctor.ProcessorOptions} ProcessorOptions */
/** @typedef {import('gray-matter').GrayMatterFile}  GrayMatterFile */

/**
 * Reads a file synchronously.
 *
 * @param      {string}  inputPath  The input path
 * @return     {GrayMatterFile}  { description_of_the_return_value }
 */
const readFileSync = (inputPath) => {
  return matter(fs.readFileSync(inputPath, "utf8"));
};

/**
 * Gets front-matter data from the file synchronously
 *
 * @param      {string}  inputPath  The input path
 * @return     {{ [key: string]: any }}  The data.
 */
const getData = (inputPath) => {
  const { data, content } = readFileSync(inputPath);
  const doc = asciidoctor.load(content);
  const attributes = doc.getAttributes();
  const title = doc.getDocumentTitle();
  debug(`Document title ${title}`);
  debug(`Document attributes: ${JSON.stringify(attributes)}`);

  return {
    title,
    asciidocAttributes: attributes,
    ...data,
  };
};

/**
 * Generates Eleventy template renderer for AsciiDoctor
 *
 * @param      {ProcessorOptions=}  convertOptions Options for Asciidoctor.converter()
 * @return     {Object}             Eleventy data processor object
 */
function eleventyAsciidoctor(convertOptions = {}) {
  debug("Converter options: ", convertOptions);

  const options = {
    ...convertOptions,
  };

  const compile = (str, inputPath) => (data) => {
    if (str) {
      // So if str has a value, it's a permalink (which can be a string or a function)
      debug(`Permalink: ${str}`);
      return typeof str === "function"
        ? str(data)
        : nunjucks.renderString(str, data);
    }

    debug(`Reading ${inputPath}`);
    const { content } = readFileSync(inputPath);

    let { base_dir } = options;
    base_dir = base_dir === undefined ? path.dirname(inputPath) : base_dir;

    if (content) {
      debug(`Converting:\n ${content}`);
      debug(`base_dir: ${base_dir}`);
      return asciidoctor.convert(content, { ...options, base_dir });
    }
  };

  return {
    read: false,
    getData,
    compile,
  };
}

module.exports = eleventyAsciidoctor;
