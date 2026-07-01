export function removeNewlines(str) {
  return str.replace(/[^\x20-\x7E]/gim, "");
}

export function getHtmlTitle(str) {
  const titleRegex = /<title>(?<title>.+)<\/title>/m;
  const res = titleRegex.exec(str);
  return res?.groups?.title;
}
