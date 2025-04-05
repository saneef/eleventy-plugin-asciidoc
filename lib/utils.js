// @ts-check

/** @typedef {import('@asciidoctor/core').Attributes} Attributes */

/**
 * Parses AsciiDoc Document attributes into object
 *
 * @param      {Attributes | string[] | string}  attrs    AsciiDoc Document Attributes
 * @return     {Attributes}  Attributes as Object
 */
function parseDocumentAttributes(attrs) {
  if (Array.isArray(attrs)) {
    return Object.fromEntries(attrs.map((a) => a.split("=")));
  }

  if (typeof attrs === "string") {
    return Object.fromEntries([attrs.split("=")]);
  }

  return attrs;
}

/**
 * Return a copy of the object, filtered to only have values for the allowed keys (or array of valid keys). Alternatively accepts a predicate indicating which keys to pick.
 *
 * @param      {object}  obj  The object
 * @param      {(key: string, value: any, obj: object ) => boolean | Array<string>}  keys    The keys
 * @return     {object}  Copy of the object with filtered values
 */
function pick(obj, keys = (k) => Boolean(k)) {
  if (Array.isArray(keys)) {
    return pick(obj, (key) => keys.includes(key));
  }

  return Object.keys(obj).reduce((acc, k) => {
    if (keys(k, obj[k], obj)) {
      return {
        [k]: obj[k],
        ...acc,
      };
    }

    return acc;
  }, {});
}

/**
 * Picks keys with matching prefix and removes prefix from keys
 *
 * @param      {object}  obj  The objec
 * @param      {string}  prefix  The key prefix
 * @return     {object}  Copy of the object with filtered values
 */
function pickByKeyPrefix(obj, prefix) {
  const filteredObj = pick(obj, (k) => k.startsWith(prefix));
  return Object.entries(filteredObj).reduce((acc, [k, v]) => {
    return {
      [k.slice(prefix.length)]: v,
      ...acc,
    };
  }, {});
}

module.exports = {
  parseDocumentAttributes,
  pickByKeyPrefix,
  pick,
};
