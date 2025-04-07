// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir", "extension_registry", "configure_extension_registry"]}] */

const asciidoctor = require("@asciidoctor/core");
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");
const nunjucks = require("nunjucks");
const { parseDocumentAttributes, pickByKeyPrefix } = require("./utils.js");

// @ts-ignore
const processor = asciidoctor();

/** @typedef {import('gray-matter').GrayMatterFile}  GrayMatterFile */

/**
 * @typedef {Object} ExtraProcessorOptions
 * @property {string=} eleventyAttributesPrefix
 * @typedef {import('@asciidoctor/core').ProcessorOptions & ExtraProcessorOptions} EleventyAsciidocOptions
 */

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
 * Creates generateGetDataFromInputPath function with options initialised.
 *
 * @param      {EleventyAsciidocOptions}  converterOptions  The converter options
 * @return     {GetDataFn}
 */

const generateGetDataFromInputPath = (converterOptions) => (inputPath) => {
  const { content } = readFileSync(inputPath);
  const { eleventyAttributesPrefix = "eleventy-" } = converterOptions;

  const doc = processor.load(content, {
    ...converterOptions,
    base_dir: getBaseDir(inputPath, converterOptions.base_dir),
  });

  const title = doc.getDocumentTitle();
  const attributes = doc.getAttributes();
  const eleventyAttributes = pickByKeyPrefix(
    attributes,
    eleventyAttributesPrefix,
  );

  debug(`Document title ${title}`);
  debug(`Document attributes: ${JSON.stringify(attributes)}`);
  debug(`Document Eleventy attributes: ${JSON.stringify(eleventyAttributes)}`);

  let data = {
    title,
    asciidocAttributes: attributes,
    ...eleventyAttributes,
  };

  // Removes undefined or null values
  // that may override Eleventy page data.
  data = Object.entries(data)
    .filter((v) => Boolean(v[1]))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  return {
    data,
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
 * @param      {EleventyAsciidocOptions=}  convertOptions Options for Asciidoctor.converter()
 * @return     {Object}             Eleventy data processor object
 */
function eleventyAsciidoctor(convertOptions = {}) {
  debug("Converter options: ", convertOptions);

  const options = {
    ...convertOptions,
  };

  const compile = (_contents, inputPath) => (data) => {
    debug(`Reading ${inputPath}`);
    const { content } = readFileSync(inputPath);

    let { base_dir, configure_extension_registry } = options;
    const attributes = parseDocumentAttributes(options.attributes ?? {});
    let { outdir } = attributes;

    base_dir = getBaseDir(inputPath, base_dir);

    if (outdir === undefined) {
      const { page } = data ?? {};

      // When front matter `permalink` is `false`, `outputPath` will be `false'.
      // So, keeping that as default value.
      const { outputPath = false } = page ?? {};
      if (outputPath !== false) {
        outdir = path.dirname(outputPath);
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

  const permalink = function (contents, _inputPath) {
    if (contents && typeof contents === "string") {
      return async (data) => {
        const permalink = nunjucks.renderString(contents, data);
        debug("permalink: ", permalink);
        return permalink;
      };
    }

    // Fallbacks to Eleventy default behaviour
    return contents;
  };

  const getInstanceFromInputPath = generateGetDataFromInputPath(options);

  return {
    compile,
    getData: ["data"],
    getInstanceFromInputPath,
    compileOptions: {
      permalink,
    },
  };
}

module.exports = eleventyAsciidoctor;
