/* eslint camelcase: ["error", {allow: ["base_dir"]}] */

import Eleventy from "@11ty/eleventy";
import test from "ava";

function getHtmlTitle(str) {
  const titleRegex = /<title>(?<title>.+)<\/title>/m;
  const res = titleRegex.exec(str);
  return res?.groups?.title;
}

test("Page titles are populated", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/front-matter/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/front-matter/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  const home = json.find((d) => d.inputPath.endsWith("home.adoc"));
  const homeTitle = getHtmlTitle(home.content);
  t.is(homeTitle, `Home`);

  const about = json.find((d) => d.inputPath.endsWith("about-us.adoc"));
  const aboutTitle = getHtmlTitle(about.content);
  t.is(aboutTitle, `About Us`);
});

test("Permalinks are mapped correctly", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/front-matter/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/front-matter/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  t.is(json.length, 4);

  const home = json.find((d) => d.inputPath.endsWith("home.adoc"));
  t.is(home.url, "/");

  const about = json.find((d) => d.inputPath.endsWith("about-us.adoc"));
  t.is(about.url, "/about/");

  const permalinkFalse = json.find((d) =>
    d.inputPath.endsWith("permalink-false.adoc"),
  );
  t.is(permalinkFalse.outputPath, false);

  const permalinkTemplate = json.find((d) =>
    d.inputPath.endsWith("permalink-template.adoc"),
  );
  t.is(permalinkTemplate.url, "/from-page-data.html");
});