# eleventy-plugin-asciidoc

Eleventy plugin to add support for [AsciiDoc](https://asciidoc.org/).
You don't need to use to shortcodes.
You can directly use AsciiDoc files (`.adoc`), just like Markdown (`.md`).

The plugin uses [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js) under the hood.

**Requires Eleventy 2.0.0-canary.19 or newer.**

## Features

- Supports the default [YAML front matter](https://www.11ty.dev/docs/data-frontmatter/).
- Supports [AsciiDoc document title](https://docs.asciidoctor.org/asciidoc/latest/document/title/#title-syntax)
- Other attributes in the AsciiDoc files are made available in templates through `asciidocAttributes`.
  - Example `:author: Jane Doe` in the `.adoc` file will be available as `asciidocAttributes.author`

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

### Customize with Options

You can pass options to `convert()` of Asciidoctor.js as second argument in `addPlugin()`.
These are the [available options](https://docs.asciidoctor.org/asciidoctor.js/latest/processor/convert-options/).

```js
const eleventyAsciidoc = require("eleventy-plugin-asciidoc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    attributes: {
      showtitle: true /* Default value: undefined */,
    },
    safe: "unsafe" /* Default value: undefined */,
  });
};
```

#### `base_dir`

The `base_dir` of [convert options](https://docs.asciidoctor.org/asciidoctor.js/latest/processor/convert-options/) is relative to the document.
This can be changed using the above [options](#customize-with-options).

#### `attributes.outdir`

By default, [`attributes.outdir`](https://docs.asciidoctor.org/asciidoc/latest/attributes/document-attributes-ref/#intrinsic-attributes) will be the path to the output directory (`permalink`) of the document.
This can be changed using the above [options](#customize-with-options).

#### `extension_registry` (⚠️ deprecated)

The convert option `extension_registry` **will not work** as intended from Asciidoctor.js v3.0 onwards.
The `extension_registry` needs a newly created registry for each conversion.
Use [the `configure_extension_registry`](#configure_extension_registry) function instead.

#### `configure_extension_registry`

The `configure_extension_registry` should be a function which accepts a `registry` (instance of `Extensions.Registry`).
During each file conversion, the function will be called with a new `registry`.
This `registry` instance can be used to register extensions.

```js
const eleventyAsciidoc = require("eleventy-plugin-asciidoc");
const myExtension = require("./my-extension.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc, {
    configure_extension_registry(registry) {
      myExtension.register(registry);
      // Or, myExtension(registry) depending on how
      // you have programmed your extension.
    },
  });
};
```

Refer to [Asciidoctor.js documentation](https://docs.asciidoctor.org/asciidoctor.js/latest/extend/extensions/) to know more about extensions.

### CSS Styles

The plugin does not include any CSS styles. It is up to you to style the content.

The quickest way to style the content is to use the CSS file from Asciidoctor.js.
The CSS file is [available on cdnjs](https://cdnjs.com/libraries/asciidoctor.js).

## Enhancements

- [Tutorial on adding syntax highlighting](https://saneef.com/tutorials/asciidoc-syntax-highlighting/)
