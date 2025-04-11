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

Usually `eleventy.config.js` or `.eleventy.js`:

```js
const eleventyAsciidoc = require("eleventy-plugin-asciidoc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAsciidoc);
};
```

## Front Matter

You can use either [Eleventy style front matter](https://www.11ty.dev/docs/data-frontmatter/#front-matter-formats) or AsciiDoc document attributes to write front matter.

Any AsciiDoc document attributes that are prefixed with `eleventy-` ([configurable](#eleventyAttributesPrefix)) can be used as front matter. _The prefix, `eleventy-`, will be removed from variable names available in the templates._

Only document-scoped attributes or variables can be used for front matter. Attributes that are written after the document title (`= Document Title`) will not be considered for front matter.

```adoc
:eleventy-permalink: /hello-world/
:eleventy-layout: base.njk

= Hello World

Hello everyone!
```

The above AsciiDoc attribute front matter is the same as YAML based front matter below:

```adoc
---
permalink: /hello-world/
layout: base.njk
---

= Hello World

Hello everyone!
```

> [!WARNING]
> Asciidoctor.js converts all attribute names to lower case letters. Example `:eleventy-aTitle:` will be made available as `atitle` in front matter data (also as `eleventy-atitle` in document attributes).

### Data Cascade

Data specified using AsciiDoc style front matter override YAML (or front matter in other Eleventy supported formats).

```adoc
---
layout: layout-a.njk
---
:eleventy-layout: layout-b.njk

= Hello World

Hello everyone!
```

In the above case, front matter data will have `{ layout: layout-b.njk }`.

In the case of `title`, [the AsciiDoc document title](https://docs.asciidoctor.org/asciidoc/latest/document/title/) (including `title` and `doctitle` attributes) takes precedence over front matter.

## Options

You can pass options as the second argument in `addPlugin()`.

### Options for this plugin

#### `eleventyAttributesPrefix`

Default value is `eleventy-`.

This config can be used to change the prefix string for [AsciiDoc style front matter](#front-matter).

#### `resolveDocumentTitle`

Default value is `false`.

If enabled, the title will be resolved from the heading of the first section in the document. Otherwise, the title will be the Level 0 heading.

```adoc
== A second level heading

This text is written in AsciiDoc format.
```

With `resolveDocumentTitle: true`, the above document will have a title (in page data). `A second level heading`.

### Options for Asciidoctor.js

All properties other than [the ones specific to the plugin](#options-for-this-plugin) will be passed to Asciidoctor.js.

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
