export const SITE_TITLE = "Teximos";
export const SITE_DESCRIPTION =
  "A publication about how software actually behaves in production, told through the failures.";
export const SITE_URL = "https://teximos.com";

// The line under the wordmark on the index. States what the publication is
// about rather than who writes it.
export const SITE_STATEMENT =
  "Software that is working exactly as written can still be wrong. This is a record of the specific ways.";

export const SITE_BLURB =
  "Each piece is one real incident from a production system, with the code that caused it and the money it cost. No tutorials. No roundups.";

export const AUTHOR = {
  name: "Jeremiah Diana",
  // Used for the Person schema on /about. Empty entries are dropped.
  // Deliberately no product links here. This is not a funnel.
  links: [
    { label: "GitHub", href: "https://github.com/jeremiahdiana/teximos" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jerehm/" },
  ],
};
