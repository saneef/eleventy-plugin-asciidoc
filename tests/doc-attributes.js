import Eleventy from "@11ty/eleventy";
import test from "ava";
import eleventyAsciidoc from "../index.js";
import { getHtmlTitle, removeNewlines } from "./utils.js";

const generateEleventyConfig =
  (options = {}) =>
  (eleventyConfig) => {
    eleventyConfig.addPlugin(eleventyAsciidoc, options);
  };

test("Eleventy prefixed attributes available as page data", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const home = json.find((d) => d.inputPath.endsWith("index.adoc"));
  t.is(home.url, "/");
  t.snapshot(removeNewlines(home.content));
});

test("Permalinks are mapped correctly", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const permalinkTemplate = json.find((d) =>
    d.inputPath.endsWith("permalink-template.adoc"),
  );
  t.is(permalinkTemplate.url, "/another-page/");

  t.snapshot(removeNewlines(permalinkTemplate.content));
});

test("Use AsciiDoc Document Title", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) =>
    d.inputPath.endsWith("title-document-title.adoc"),
  );

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, `Document Title`);
});

test("Use title from YAML front matter", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) =>
    d.inputPath.endsWith("title-yaml-front-matter.adoc"),
  );

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, `Title from YAML Front Matter`);
});

test("Use title from AsciiDoc style front matter", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) =>
    d.inputPath.endsWith("title-asciidoc-front-matter.adoc"),
  );

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, `Title from AsciiDoc style front matter`);
});

test("Don't reslove document title", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig(),
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) =>
    d.inputPath.endsWith("title-do-not-resolve-doc-title.adoc.adoc"),
  );

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, undefined);
});

test("Reslove document title", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      config: generateEleventyConfig({ resolveDocumentTitle: true }),
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) =>
    d.inputPath.endsWith("title-resolve-doc-title.adoc"),
  );

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, `A second level heading`);
});
