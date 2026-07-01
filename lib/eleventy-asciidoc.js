// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir", "extension_registry", "configure_extension_registry"]}] */

import { load, Extensions, convert } from "@asciidoctor/core";
import libDebug from "debug";
import fs from "node:fs/promises";
import matter from "gray-matter";
import path from "path";
import nunjucks from "nunjucks";
import { parseDocumentAttributes } from "./utils/asciidoc.js";
import { pickByKeyPrefix, mapKeys, pick } from "./utils/object.js";

const debug = libDebug("eleventy-plugin-asciidoc");

/** @typedef {import('gray-matter').GrayMatterFile}  GrayMatterFile */

/**
 * @typedef {Object} ExtraProcessorOptions
 * @property {string=} eleventyAttributesPrefix
 * @property {Boolean} [resolveDocumentTitle=false]
 * @typedef {import('@asciidoctor/core').ProcessorOptions & ExtraProcessorOptions} EleventyAsciidocOptions
 */

/**
 * Reads files and separates front matter and content asynchronously.
 *
 * @param      {string}   inputPath  Path to file
 * @return     {Promise<GrayMatterFile>}
 */
async function readFileAsync(inputPath) {
  try {
    const fileContent = await fs.readFile(inputPath);
    return matter(fileContent);
  } catch (e) {
    throw new Error(`Unable to read path. ${e.error}`);
  }
}

/**
 * Gets the title from ascii document document.
 *
 * @param      {object}   document         The document
 * @param      {boolean}  [resolve=false]  The resolve
 * @return     {string | undefined}   The title of the document.
 */
function getTitleFromAsciiDocDocument(document, resolve = false) {
  if (resolve) {
    return document.getDocumentTitle();
  }

  return document.getHeader()?.title;
}

/** @typedef {(inputPath: string) => Object.<string, any>} GetDataFn
 * Gets front-matter data from the file synchronously
 */

/**
 * Creates generateGetDataFromInputPath function with options initialised.
 *
 * @param      {EleventyAsciidocOptions}  converterOptions  The converter options
 * @return     {GetDataFn}
 */

const generateGetDataFromInputPath =
  (converterOptions) => async (inputPath) => {
    const { content } = await readFileAsync(inputPath);
    const {
      eleventyAttributesPrefix = "eleventy-",
      resolveDocumentTitle = false,
      ...restOfConverterOptions
    } = converterOptions;

    const doc = await load(content, {
      ...restOfConverterOptions,
      base_dir: getBaseDir(inputPath, restOfConverterOptions.base_dir),
    });

    const title = getTitleFromAsciiDocDocument(doc, resolveDocumentTitle);

    const attributes = doc.getAttributes();

    let eleventyAttributes = pickByKeyPrefix(
      attributes,
      eleventyAttributesPrefix,
    );
    eleventyAttributes = mapKeys(eleventyAttributes, (k) =>
      k.slice(eleventyAttributesPrefix.length),
    );

    debug(`Document title ${title}`);
    debug(`Document attributes: ${JSON.stringify(attributes)}`);
    debug(
      `Document Eleventy attributes: ${JSON.stringify(eleventyAttributes)}`,
    );

    let data = {
      asciidocAttributes: attributes,
      ...eleventyAttributes,
      // Pass title only if defined. Otherwise, `undefined`
      // will override the title in `eleventyAttributes`
      ...(title === undefined ? {} : { title }),
    };

    // Removes undefined values
    // that may override Eleventy page data.
    data = pick(data, (k, v) => v !== undefined);

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

  const compile = (_contents, inputPath) => async (data) => {
    debug(`Reading ${inputPath}`);
    const { content } = await readFileAsync(inputPath);

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
        registry = Extensions.create();
        configure_extension_registry(registry);
      }

      return convert(content, {
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

export default eleventyAsciidoctor;
