import Eleventy from "@11ty/eleventy";
import test from "ava";

test("Render with shout extension", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/extensions/src",
    "./tests/fixtures/extensions/_site",
    {
      configPath: "./tests/fixtures/extensions/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  // Here two pages are checked because, from asciidoctor.js v3
  // onwards registry can only be used on one convert. Unless,
  // a fresh registry is passed, in the subsequent convert call
  // the content won't be processed with the extensions.
  // See: https://github.com/asciidoctor/asciidoctor.js/issues/1709
  t.is(json.length, 2);

  const page1 = json.find((d) => d.inputPath.endsWith("index.adoc"));
  t.is(
    page1.content.trim(),
    `<div class="paragraph">
<p>IF IT ALL WORKS, THIS TEXT SHOULD BE IN UPPER CASE.</p>
</div>`,
  );

  const page2 = json.find((d) => d.inputPath.endsWith("another-page.adoc"));
  t.is(
    page2.content.trim(),
    `<div class="paragraph">
<p>IF IT ALL WORKS, THIS TEXT SHOULD ALSO BE IN UPPER CASE.</p>
</div>`,
  );
});