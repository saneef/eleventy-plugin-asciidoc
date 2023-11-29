const test = require("ava").default;
const { parseDocumentAttributes } = require("../lib/utils.js");

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
