// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir", "extension_registry", "configure_extension_registry"]}] */

const asciidoctor = require("@asciidoctor/core");
const debug = require("debug")("eleventy-plugin-asciidoc");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");
const nunjucks = require("nunjucks");

const EleventyExtensionMap = require("@11ty/eleventy/src/EleventyExtensionMap");
const TemplateConfig = require("@11ty/eleventy/src/TemplateConfig");

/** @type {EleventyExtensionMap} */
let eleventyExtensionMap;
/** @type {import("@11ty/eleventy/src/UserConfig")} */
let eleventyConfig;

// @ts-ignore
const processor = asciidoctor();

/** @typedef {import('@asciidoctor/core').ProcessorOptions} ProcessorOptions */
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
 * Initialise plugin, retrieve somme Eleventy config valuees
 */
const init = function () {
  eleventyConfig = this.config;
  eleventyExtensionMap = new EleventyExtensionMap(
    [],
    new TemplateConfig(this.config),
  );
};

/**
 * Gets front-matter data from the file synchronously
 *
 * @param      {string}  inputPath  The input path
 * @return     {{ [key: string]: any }}  The data.
 */
const getData = (inputPath) => {
  const { data, content } = readFileSync(inputPath);
  const doc = processor.load(content);
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

  const compile = (str, inputPath) => async (data) => {
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
    base_dir = base_dir === undefined ? path.dirname(inputPath) : base_dir;

    if (content) {
      debug(`Converting:\n ${content}`);
      debug(`base_dir: ${base_dir}`);

      let registry;
      if (typeof configure_extension_registry === "function") {
        debug(`Creating an extension registry`);
        registry = processor.Extensions.create();
        configure_extension_registry(registry);
      }

      const preTemplateEngine = data?.asciidocPreTemplateEngine;
      if (preTemplateEngine) {
        debug(`preTemplating with ${preTemplateEngine}`);
        let engine;
        if (typeof preTemplateEngine === "string") {
          engine = eleventyExtensionMap.engineManager.getEngine(
            preTemplateEngine,
            // XXX: find a better value?
            { includes: "" },
            eleventyConfig.extensionMap,
          );
        } else {
          engine = preTemplateEngine;
        }

        const preTemplateEngineRender = await engine.compile(content);

        const preRenderedContent = await preTemplateEngineRender(data);

        return processor.convert(preRenderedContent, {
          ...options,
          base_dir,
          extension_registry: registry,
        });
      }

      return processor.convert(content, {
        ...options,
        base_dir,
        extension_registry: registry,
      });
    }
  };

  return {
    read: false,
    getData,
    compile,
    init,
  };
}

module.exports = eleventyAsciidoctor;
