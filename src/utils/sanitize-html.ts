import sanitize from "sanitize-html";

const sanitizeHtml = (content: string) => {
  return sanitize(content, {
    allowedIframeHostnames: ["www.youtube.com"],
    allowedTags: ["h1", "h2", "h3", "blockquote", "div", "hr", "li", "ol", "p", "pre", "ul", "a", "abbr", "b", "code", "em", "i", "mark", "q", "s", "span", "strong", "sub", "sup", "iframe"],
    allowedAttributes: {
      iframe: ["src", "allowfullscreen", "autoplay", "endtime", "ivloadpolicy", "origin", "loop", "playlist", "start"],
      div: ["data-youtube-video"],
    },
  });
};

export { sanitizeHtml };
