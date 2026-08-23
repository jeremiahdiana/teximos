# Teximos stats: what you can check, and how

Teximos ships almost no JavaScript on purpose, so it does not carry a heavy
analytics script. This is how to see who is reading it anyway, ordered from
"available right now" to "needs a two minute setup".

## 1. Cloudflare request analytics (available now, zero setup)

The site is served by Cloudflare, so Cloudflare already counts every request.

- Go to the Cloudflare dashboard, pick the `teximos.com` zone, open **Analytics
  and Logs**.
- You get: total requests, data served, cached versus uncached, and the split of
  status codes (how many 200s versus 404s).

What it does not tell you: how many are real humans versus bots and crawlers, and
which article a person actually read. Request counts are inflated by automated
traffic, so treat them as a ceiling, not a readership number.

## 2. Cloudflare Web Analytics (turn this on, two minutes, no code)

This is the real reader dashboard. Because teximos is already proxied through
Cloudflare, you can turn it on at the edge with no change to the site and no
script added to our source, so the zero-JavaScript design stays intact.

Steps:

1. Cloudflare dashboard, left sidebar, **Analytics and Logs**, then **Web
   Analytics**.
2. **Add a site**, enter `teximos.com`.
3. When it offers **automatic setup**, choose it. Cloudflare injects the small
   measurement beacon at the edge for you. Do not paste a script tag into the
   repo. Leave automatic setup on.

Once it is live you get, per day and per page:

- **Page views and visits**, split by real visitors rather than raw requests.
- **Top pages**, so you can see which article is actually being read.
- **Referrers**, so you can see whether traffic came from search, a link, or
  social.
- **Countries and device types.**
- **Core Web Vitals**, the loading and layout speed scores that also feed SEO.

It is cookieless and privacy first, so there is no per person tracking and no
cookie banner to add. The tradeoff is that it cannot follow one individual across
visits, which for a publication is exactly the tradeoff you want.

If automatic setup is ever unavailable for this kind of Cloudflare project, the
fallback is a single beacon script tag in `src/layouts/Base.astro`, with the
token from that same Web Analytics page. That is the only case that puts any
JavaScript into our source, so use it only if the edge option does not appear.

## 3. Google Search Console (highest value for a blog, your hands)

Search Console is where a publication learns what it is actually being found for.
It shows impressions, clicks, the search queries that surfaced the site and the
average position for each. This is more useful than pure traffic counts, because
it tells you which pieces are earning search interest.

Setup, once:

1. Go to search.google.com/search-console.
2. Add a **Domain** property for `teximos.com`. It verifies with a DNS TXT record
   you add in Cloudflare, and covers every subdomain and both http and https.
3. Use whichever Google account already holds your other properties, since one
   account can hold unlimited ones.
4. Submit the sitemap: `https://teximos.com/sitemap-index.xml`.
5. Use **URL Inspection** on the homepage and request indexing.

## 4. Buttondown (after the newsletter is wired)

Once the subscribe form points at the real Buttondown account, the Buttondown
dashboard shows subscriber count over time, plus open rates on each email you
send. That is the cleanest signal that the writing is landing, because a
subscribe is a stronger vote than a page view.

## Quick reference

| Signal | Where | Setup | Tells you |
| --- | --- | --- | --- |
| Requests | Cloudflare Analytics and Logs | none | rough traffic, bot inflated |
| Page views, top pages, referrers | Cloudflare Web Analytics | 2 min, no code | real readership |
| Search queries, clicks, position | Google Search Console | one time, DNS | what search finds you for |
| Subscribers, open rate | Buttondown | after newsletter wired | who wants the next piece |
