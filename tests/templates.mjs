import Eleventy from "@11ty/eleventy";
import test from "ava";

test("Render with custom Asciidoc template", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/templates/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/templates/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  t.is(json.length, 1);
  t.is(
    json[0].content.trim(),
    `<pre class="code ruby">puts "Hello, World!"</pre>`,
  );
});
