// @ts-check
const path = require("path");
const test = require("ava").default;
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));

const eleventyAsciidoc = require("../lib/eleventy-asciidoc.js");

const sourcePath = path.join("tests/fixtures");
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
    path.join(sourcePath, "with-asciidoc-attributes.adoc")
  );
  const result = compile();
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  t.is(result, output);
});

test("Get data from front matter", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getData(path.join(sourcePath, "hello.adoc"));

  t.is(result.title, "Hello world");
  t.is(result.mySlug, "hello-world");
});

test("Get title from AsciiDoc document title", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getData(
    path.join(sourcePath, "with-asciidoc-attributes.adoc")
  );

  t.is(result.title, "Hello world");
});

test("Populate data.asciidocAttributes with AsciiDoc attributes", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getData(
    path.join(sourcePath, "with-asciidoc-attributes.adoc")
  );

  t.is(result.asciidocAttributes.author, "Jane Doe");
});
