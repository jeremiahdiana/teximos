<?xml version="1.0" encoding="UTF-8"?>
<!--
  Makes /rss.xml readable when a human opens it in a browser, instead of the
  "This XML file does not appear to have any style information" tree. Feed
  readers ignore the stylesheet entirely, so the feed itself is unchanged.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> feed</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <style>
          :root {
            --bg: #fcfcfb; --fg: #16161a; --muted: #6e6e78; --rule: #e2e2dc;
          }
          @media (prefers-color-scheme: dark) {
            :root { --bg: #0d0d0f; --fg: #e8e8ea; --muted: #86868f; --rule: #26262c; }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0; background: var(--bg); color: var(--fg);
            font-family: Iowan Old Style, Charter, Georgia, serif;
            font-size: 17px; line-height: 1.7;
            -webkit-font-smoothing: antialiased;
          }
          .shell { max-width: 44rem; margin: 0 auto; padding: 0 1.5rem; }
          .kicker {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: .625rem; text-transform: uppercase; letter-spacing: .13em;
            color: var(--muted); display: block;
          }
          header { border-bottom: 1px solid var(--rule); padding: 3rem 0 2.25rem; }
          h1 { font-size: 2rem; letter-spacing: -.03em; margin: .7rem 0 .6rem; line-height: 1.15; }
          .desc { color: var(--muted); margin: 0; }
          .note {
            margin-top: 1.5rem; padding: .85rem 1rem; border: 1px solid var(--rule);
            border-radius: 4px; font-size: .9375rem; color: var(--muted);
          }
          .note code {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: .8em; color: var(--fg);
          }
          ul { list-style: none; margin: 0; padding: 0; }
          li { border-bottom: 1px solid var(--rule); padding: 1.6rem 0; }
          h2 { font-size: 1.3125rem; letter-spacing: -.02em; margin: .5rem 0 .4rem; line-height: 1.25; }
          a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--rule); }
          a:hover { border-bottom-color: var(--fg); }
          h2 a { border-bottom: none; }
          h2 a:hover { opacity: .6; }
          p { margin: 0; color: var(--muted); font-size: .9375rem; line-height: 1.55; }
          footer { padding: 2rem 0 3rem; }
          footer a { font-family: ui-monospace, Menlo, monospace; font-size: .6875rem;
                     text-transform: uppercase; letter-spacing: .09em; color: var(--muted); }
        </style>
      </head>
      <body>
        <div class="shell">
          <header>
            <span class="kicker">RSS feed</span>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
            <div class="note">
              This is a feed, not a page. Paste
              <code><xsl:value-of select="/rss/channel/link"/>rss.xml</code>
              into a reader to subscribe.
            </div>
          </header>

          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <span class="kicker"><xsl:value-of select="pubDate"/></span>
                <h2>
                  <a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ul>

          <footer>
            <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
              Back to Teximos
            </a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
