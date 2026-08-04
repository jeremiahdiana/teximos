export const SITE_TITLE = "Teximos";
export const SITE_DESCRIPTION =
  "A publication about technology: what just shipped, what it actually does and what it costs when it breaks.";
export const SITE_URL = "https://teximos.com";

// The line under the wordmark on the index. States what the publication is
// about rather than who writes it.
//
// Deliberately wider than the first version, which described only the
// production incident write-ups and read as a bug diary. The remit is the
// industry: releases, product decisions, opinion and the engineering.
export const SITE_STATEMENT =
  "A publication about technology and the people shipping it. What just changed, what it actually does and what it costs when it breaks.";

export const SITE_BLURB =
  "Model releases, product decisions, opinions with the reasoning left in and real incidents with the code attached. Written so that anyone who works near software can read it, not only the people who wrote it.";

export const AUTHOR = {
  name: "Jeremiah Diana",
  // Used for the Person schema on /about. Empty entries are dropped.
  // Deliberately no product links here. This is not a funnel.
  links: [
    { label: "GitHub", href: "https://github.com/jeremiahdiana/teximos" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jerehm/" },
  ],
};
