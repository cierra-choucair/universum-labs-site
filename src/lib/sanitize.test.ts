import { describe, expect, it } from "vitest";

import { sanitizeWordPressHtml, stripHtml } from "./sanitize";

describe("sanitizeWordPressHtml", () => {
  it("removes script tags entirely", () => {
    const dirty = `<p>Hello</p><script>alert("xss")</script>`;
    const clean = sanitizeWordPressHtml(dirty);
    expect(clean).toContain("<p>Hello</p>");
    expect(clean).not.toContain("script");
    expect(clean).not.toContain("alert");
  });

  it("removes event handlers and javascript: URLs", () => {
    const dirty = `<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">click</a>`;
    const clean = sanitizeWordPressHtml(dirty);
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("javascript:");
  });

  it("keeps common editorial markup", () => {
    const html = `<h2>Title</h2><p><strong>Bold</strong> and <em>italic</em></p><blockquote cite="https://example.org">quote</blockquote><ul><li>item</li></ul>`;
    const clean = sanitizeWordPressHtml(html);
    expect(clean).toContain("<h2>Title</h2>");
    expect(clean).toContain("<strong>Bold</strong>");
    expect(clean).toContain("<blockquote");
    expect(clean).toContain("<li>item</li>");
  });

  it("forces safe rel on links and lazy loading on images", () => {
    const html = `<a href="https://example.org">out</a><img src="https://example.org/a.jpg" alt="a">`;
    const clean = sanitizeWordPressHtml(html);
    expect(clean).toContain('rel="noopener noreferrer"');
    expect(clean).toContain('loading="lazy"');
  });

  it("drops iframes and styles", () => {
    const html = `<iframe src="https://evil.example"></iframe><style>body{display:none}</style><p>ok</p>`;
    const clean = sanitizeWordPressHtml(html);
    expect(clean).not.toContain("iframe");
    expect(clean).not.toContain("display:none");
    expect(clean).toContain("<p>ok</p>");
  });
});

describe("stripHtml", () => {
  it("removes all markup", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });
});
