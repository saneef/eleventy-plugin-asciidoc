import Eleventy from "@11ty/eleventy";
import test from "ava";
import { getHtmlTitle } from "./utils.js";

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

test("JSON front matter parsed", async (t) => {
  const elev = new Eleventy(
    "./tests/fixtures/front-matter/",
    "./tests/fixtures/_site",
    {
      configPath: "./tests/fixtures/front-matter/.eleventy.js",
    },
  );
  const json = await elev.toJSON();

  const page = json.find((d) => d.inputPath.endsWith("front-matter-json.adoc"));

  const pageTitle = getHtmlTitle(page.content);
  t.is(pageTitle, `JSON Front Matter`);

  t.is(page.url, "/front-matter-json/");
});
