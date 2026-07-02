module.exports = ({ node }) => {
  const level = node.getLevel() + 2;
  const title = node.getTitle();
  const style = node.getStyle();
  const content = node.getSource();

  let comment = `<!-- Processed by template: listing -->`;
  let titleEl = "";

  if (title) {
    titleEl = `<h${level} class="listingblock-title">${title}</h${level}>`;
  }

  if (style === "source") {
    const lang = node.getAttribute("language");

    if (lang && lang !== "text") {
      comment = `<!-- Processed by template: listing, source -->`;
      return `${comment}\n${titleEl}\n<pre class="code ${lang}">${content}</pre>`;
    }
  }

  return `${comment}\n${titleEl}\n<pre>${content}</pre>`;
};
