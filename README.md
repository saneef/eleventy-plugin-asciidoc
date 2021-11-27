# eleventy-plugin-asciidoc

Eleventy plugin to add support for AsciiDoc. The plugin uses [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js) under the hood.

**Requires Eleventy `1.0.0` or newer.**

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
    /* Converter options */
    showtitle: true,
    safe: "unsafe",
  });
};
```
