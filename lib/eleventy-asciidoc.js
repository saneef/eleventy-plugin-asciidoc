// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir", "extension_registry", "configure_extension_registry"]}] */

const asciidoctor = require("@asciidoctor/core");
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");
const nunjucks = require("nunjucks");
const { parseDocumentAttributes } = require("./utils.js");

// @ts-ignore
const processor = asciidoctor();

/** @typedef {import('@asciidoctor/core').ProcessorOptions} ProcessorOptions */
/** @typedef {import('gray-matter').GrayMatterFile}  GrayMatterFile */

/**
 * Reads a file synchronously.
 *
 * @param      {string}  inputPath  The input path
 * @return     {GrayMatterFile}
 */
const readFileSync = (inputPath) => {
  return matter(fs.readFileSync(inputPath, "utf8"));
};

/** @typedef {(inputPath: string) => Object.<string, any>} GetDataFn
 * Gets front-matter data from the file synchronously
 */

/**
 * Creates getData function with options initialised.
 *
 * @param      {ProcessorOptions}  converterOptions  The converter options
 * @return     {GetDataFn}
 */
const generateGetData = (converterOptions) => (inputPath) => {
  const { data, content } = readFileSync(inputPath);
  const doc = processor.load(content, {
    ...converterOptions,
    base_dir: getBaseDir(inputPath, converterOptions.base_dir),
  });
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
 * Gets the base directory if available, otherwise from input path
 *
 * @param      {string}  inputPath  The input path
 * @param      {string=}  base_dir   The base directory
 * @return     {string}  The base dir.
 */
function getBaseDir(inputPath, base_dir) {
  return base_dir === undefined ? path.dirname(inputPath) : base_dir;
}

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

    let { base_dir, configure_extension_registry } = options;
    const attributes = parseDocumentAttributes(options.attributes ?? {});
    let { outdir } = attributes;

    base_dir = getBaseDir(inputPath, base_dir);

    if (outdir === undefined) {
      const { page } = data ?? {};
      const { outputPath } = page ?? {};
      if (outputPath !== undefined) {
        if (outputPath !== false) {
          outdir = path.dirname(outputPath);
        }
      }
    }

    const converterOptions = {
      ...options,
      attributes: {
        ...attributes,
        outdir,
      },
      base_dir,
    };

    if (content) {
      debug(`Converting:\n ${content}`);
      debug(`base_dir: ${base_dir}`);
      debug(`attributes:\n ${JSON.stringify(attributes)}`);

      let registry;
      if (typeof configure_extension_registry === "function") {
        debug(`Creating an extension registry`);
        registry = processor.Extensions.create();
        configure_extension_registry(registry);
      }

      return processor.convert(content, {
        ...converterOptions,
        extension_registry: registry,
      });
    }
  };

  const getData = generateGetData(options);

  return {
    read: false,
    getData,
    compile,
  };
}

module.exports = eleventyAsciidoctor;
