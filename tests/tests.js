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

/**
 * Removes newlines.
 *
 * @param      {string}  str     The string
 * @return     {string}  Result
 */
function removeNewlines(str) {
  return str.replace(/[\n\r]+/g, " ");
}

test("Render AsciiDoc", async (t) => {
  const processor = eleventyAsciidoc();
  const compile = processor.compile();
  const result = compile({
    page: {
      inputPath: path.join(sourcePath, "hello.adoc"),
    },
  });
  const output = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  t.is(result, output);
});

test("Render AsciiDoc with converter options", async (t) => {
  const processor = eleventyAsciidoc({
    attributes: { showtitle: true },
  });
  const compile = processor.compile();
  const result = compile({
    page: {
      inputPath: path.join(sourcePath, "with-doc-title.adoc"),
    },
  });
  const output = `<h1>Hello world</h1>
<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  t.is(result, output);
});

test("Passback str if is 'string'", async (t) => {
  const input = "permalink";
  const processor = eleventyAsciidoc();
  const compile = processor.compile("permalink");
  const result = compile({
    page: {
      inputPath: path.join(sourcePath, "hello.adoc"),
    },
  });

  t.is(result, input);
});

test("Apply str if it is 'function'", async (t) => {
  const input = `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`;

  const processor = eleventyAsciidoc();
  const compile = processor.compile(removeNewlines);
  const result = compile(input);

  t.is(result, removeNewlines(input));
});

test("Get data", async (t) => {
  const processor = eleventyAsciidoc();
  const result = processor.getData(path.join(sourcePath, "hello.adoc"));

  t.deepEqual(result, { title: "Hello world" });
});
