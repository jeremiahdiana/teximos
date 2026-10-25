export const SITE_TITLE = "Teximos";
export const SITE_DESCRIPTION =
  "Technology news, explained properly. What shipped, what it means and who it affects.";
export const SITE_URL = "https://teximos.com";

// The line under the wordmark on the index. States what the publication is
// about rather than who writes it.
export const SITE_STATEMENT =
  "Technology news, explained properly. What shipped, what it means and who it affects.";

export const SITE_BLURB =
  "AI, chips, space, security and policy, each story checked against the primary source and written so anyone can follow it.";

// Email newsletter. Buttondown's embed is a plain form POST, so signup adds
// real subscribers with zero JavaScript. Swap `user` for the real account and
// both the /subscribe page and the homepage block pick it up.
export const NEWSLETTER = {
  user: "teximos",
  get action() {
    return `https://buttondown.email/api/emails/embed-subscribe/${this.user}`;
  },
};

export const AUTHOR = {
  name: "Jeremiah Diana",
  // Used for the Person schema on /about. Empty entries are dropped.
  // Deliberately no product links here. This is not a funnel.
  links: [
    { label: "GitHub", href: "https://github.com/jeremiahdiana/teximos" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jerehm/" },
    { label: "Instagram", href: "https://www.instagram.com/jerehm/" },
  ],
};
