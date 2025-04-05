function removeNewlines(str) {
  return str.replace(/[^\x20-\x7E]/gim, "");
}

module.exports = {
  removeNewlines,
};
