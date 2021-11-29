# eleventy-plugin-asciidoc

Eleventy plugin to add support for [AsciiDoc](https://asciidoc.org/). You don't need to use to shortcodes. You can directly use AsciiDoc files (`.adoc`), just like Markdown (`.md`).

The plugin uses [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js) under the hood.

**Requires Eleventy `1.0.0` or newer.**

## Features

- Supports the default [YAML front matter](https://www.11ty.dev/docs/data-frontmatter/).
- Supports [AsciiDoc document title](https://docs.asciidoctor.org/asciidoc/latest/document/title/#title-syntax)
- Other attributes in the AsciiDoc files are made available through `page.asciidocAttributes`.
  - Example `:author: Jane Doe` in the `.adoc` file will be available as `page.asciidocAttrbutes.author`

## Usage

### Install

```sh
npm install eleventy-plugin-asciidoc
```

### Add to Configuration File

Usually `.eleventy.js`:

```js
const eleventyAsciidoc = require("eleventy-plugin-asciidoc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc);
};
```

#### Customize with Options

You can pass options to `convert()` of Asciidoctor.js as second argument in `addPlugin()`. These are the [available options](https://docs.asciidoctor.org/asciidoctor.js/latest/processor/convert-options/).

```js
const eleventyAsciidoc = require("eleventy-plugin-asciidoc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    showtitle: true /* Default value: true */,
    safe: "unsafe" /* Default value: undefined */,
  });
};
```
