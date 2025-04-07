// @ts-check
/* eslint camelcase: ["error", {allow: ["base_dir"]}] */

const path = require("path");
const test = require("ava").default;
const { rimraf } = require("rimraf");

const eleventyAsciidoc = require("../lib/eleventy-asciidoc.js");

const sourcePath = path.join("tests/fixtures/compile");
const outputBase = path.join("tests/output/");

test.before("Cleanup output", async () => rimraf(outputBase));
test.after.always("Cleanup output", async () => rimraf(outputBase));

test("Render AsciiDoc", async (t) => {
  const processor = eleventyAsciidoc();
  const compile = processor.compile(null, path.join(sourcePath, "hello.adoc"));
  const result = compile();
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  t.is(result, output);
});

test("Render AsciiDoc with converter options", async (t) => {
  const processor = eleventyAsciidoc({
    attributes: { showtitle: false },
  });
  const compile = processor.compile(
    null,
    path.join(sourcePath, "with-asciidoc-attributes.adoc"),
  );
  const result = compile();
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  t.is(result, output);
});

test("Get title from AsciiDoc document title", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getInstanceFromInputPath(
    path.join(sourcePath, "with-asciidoc-attributes.adoc"),
  );

  t.is(result.data.title, "Hello world");
});

test("Populate data.asciidocAttributes with AsciiDoc attributes", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getInstanceFromInputPath(
    path.join(sourcePath, "with-asciidoc-attributes.adoc"),
  );

  t.is(result.data.asciidocAttributes.author, "Jane Doe");
});

test("Render AsciiDoc in 'unsafe' mode with 'include'", async (t) => {
  const processor = eleventyAsciidoc({ safe: "unsafe" });
  const compile = processor.compile(
    null,
    path.join(sourcePath, "with-include.adoc"),
  );
  const result = compile();
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>
<div class="paragraph">
<p>This text is written in plain text.</p>
</div>`;

  t.is(result, output);
});

test("Render AsciiDoc in 'unsafe' mode with provided 'base_dir'", async (t) => {
  const processor = eleventyAsciidoc({
    safe: "unsafe",
    base_dir: "./tests/fixtures/compile/text-files/",
  });
  const compile = processor.compile(
    null,
    path.join(sourcePath, "with-base-dir.adoc"),
  );
  const result = compile();
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>
<div class="paragraph">
<p>This text is written in plain text.</p>
</div>`;

  t.is(result, output);
});
