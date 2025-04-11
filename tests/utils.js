function removeNewlines(str) {
  return str.replace(/[^\x20-\x7E]/gim, "");
}

function getHtmlTitle(str) {
  const titleRegex = /<title>(?<title>.+)<\/title>/m;
  const res = titleRegex.exec(str);
  return res?.groups?.title;
}

module.exports = {
  removeNewlines,
  getHtmlTitle,
};
