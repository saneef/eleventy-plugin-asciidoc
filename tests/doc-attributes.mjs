import Eleventy from "@11ty/eleventy";
import test from "ava";
import { removeNewlines } from "./utils.js";

test("Eleventy prefixed attributes available as page data", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/doc-attributes/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  const home = json.find((d) => d.inputPath.endsWith("index.adoc"));
  t.is(home.url, "/");
  t.snapshot(removeNewlines(home.content));
});

test("Permalinks are mapped correctly", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/doc-attributes/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/doc-attributes/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  const permalinkTemplate = json.find((d) =>
    d.inputPath.endsWith("permalink-template.adoc"),
  );
  t.is(permalinkTemplate.url, "/another-page/");

  t.snapshot(removeNewlines(permalinkTemplate.content));
});