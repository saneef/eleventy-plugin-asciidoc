// @ts-check

const asciidoctor = require("asciidoctor").default();
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");

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
  debug(`Document attributes: ${attributes}`);

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

  const compile = (_, inputPath) => () => {
    debug(`Reading ${inputPath}`);
    const { content } = readFileSync(inputPath);

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
