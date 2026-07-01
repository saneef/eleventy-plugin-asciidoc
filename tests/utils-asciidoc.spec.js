import test from "ava";
import { parseDocumentAttributes } from "../lib/utils/asciidoc.js";

test("parseDocumentAttributes: should return object as it is", async (t) => {
  t.deepEqual(parseDocumentAttributes({ some: "value" }), { some: "value" });
});

test("parseDocumentAttributes: should parse string to object", async (t) => {
  t.deepEqual(parseDocumentAttributes("some=value"), { some: "value" });
});

test("parseDocumentAttributes: should parse array of strings to object", async (t) => {
  t.deepEqual(parseDocumentAttributes(["some=value", "foo=bar"]), {
    some: "value",
    foo: "bar",
  });
});
