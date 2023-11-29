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

module.exports = {
  parseDocumentAttributes,
};
