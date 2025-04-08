import test from "ava";
import Eleventy from "@11ty/eleventy";

test("Render alternative Asciidoc file extensions, '.asciidoc' and '.ad'", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/file-extensions/src",
    "./tests/fixtures/file-extensions/_site",
    {
      configPath: "./tests/fixtures/file-extensions/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  t.is(json.length, 3);

  const page1 = json.find((d) => d.inputPath.endsWith("index.asciidoc"));
  t.is(
    page1.content.trim(),
    `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`,
  );

  const page2 = json.find((d) => d.inputPath.endsWith("another-page.adoc"));
  t.is(
    page2.content.trim(),
    `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`,
  );

  const page3 = json.find((d) => d.inputPath.endsWith("yet-another-page.ad"));
  t.is(
    page3.content.trim(),
    `<div class="paragraph">
<p>This text is written in AsciiDoc format.</p>
</div>`,
  );
});
