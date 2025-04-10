const test = require("ava").default;
const { pick, pickByKeyPrefix, mapKeys } = require("../lib/utils/object.js");

test("pick: should pick properites based on truthy values", async (t) => {
  t.deepEqual(pick({ a: "a", b: "b", c: false }), {
    a: "a",
    b: "b",
  });
});

test("pick: should pick properites based on predicate", async (t) => {
  t.deepEqual(
    pick({ a: "a", b: "b", c: false }, (_k, v) => !v),
    {
      c: false,
    },
  );
});

test("pick: should pick properites using array of keys", async (t) => {
  t.deepEqual(pick({ a: "a", b: "b", c: "c" }, ["a", "b"]), { a: "a", b: "b" });
});

test("pickByKeyPrefix: should pick properites based on key prefix", async (t) => {
  t.deepEqual(pickByKeyPrefix({ aKey: "a", anotherKey: "b", c: "c" }, "a"), {
    aKey: "a",
    anotherKey: "b",
  });
});

test("mapKeys: should return the object when mapKeys in undefined", async (t) => {
  t.deepEqual(mapKeys({ "prefix-a": "a", "prefix-b": "b" }), {
    "prefix-a": "a",
    "prefix-b": "b",
  });
});
test("mapKeys: should map keys", async (t) => {
  t.deepEqual(
    mapKeys({ "prefix-a": "a", "prefix-b": "b" }, (k) =>
      k.replace("prefix-", ""),
    ),
    {
      a: "a",
      b: "b",
    },
  );
});
