/* eslint camelcase: ["error", {allow: ["base_dir"]}] */

import Eleventy from "@11ty/eleventy";
import test from "ava";
import { removeNewlines } from "./utils.js";

test("Permalinks are mapped correctly", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/attributes-to-front-matter/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/attributes-to-front-matter/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  t.is(json.length, 2);

  const home = json.find((d) => d.inputPath.endsWith("home.adoc"));
  t.is(home.url, "/");
  t.snapshot(removeNewlines(home.content));

  const permalinkTemplate = json.find((d) =>
    d.inputPath.endsWith("permalink-template.adoc"),
  );
  t.is(permalinkTemplate.url, "/another-index.html");

  t.snapshot(removeNewlines(permalinkTemplate.content));
});