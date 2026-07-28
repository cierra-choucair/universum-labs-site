import sanitizeHtmlLib from "sanitize-html";

/**
 * Sanitize HTML received from the headless WordPress API before it is
 * rendered. Runs server-side only; the client always receives clean
 * markup. Allows the block-editor output WordPress commonly produces
 * and nothing executable.
 */
export function sanitizeWordPressHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      "a",
      "abbr",
      "b",
      "blockquote",
      "br",
      "caption",
      "cite",
      "code",
      "del",
      "dd",
      "dl",
      "dt",
      "em",
      "figcaption",
      "figure",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      "ins",
      "kbd",
      "li",
      "mark",
      "ol",
      "p",
      "pre",
      "q",
      "s",
      "small",
      "span",
      "strong",
      "sub",
      "sup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
      blockquote: ["cite"],
      q: ["cite"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Force safe link behavior on external content.
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtmlLib.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

/** Strip all tags — used for titles and excerpts. */
export function stripHtml(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
