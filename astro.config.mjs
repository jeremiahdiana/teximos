// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

/**
 * Two grayscale code themes. The site is strictly monochrome, so syntax
 * hierarchy comes from lightness and weight instead of hue. Keywords are the
 * lightest and heaviest, comments the dimmest, everything else sits between.
 */
const codeLight = {
  name: "teximos-light",
  type: "light",
  fg: "#35353c",
  bg: "#f4f4f0",
  settings: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#a0a0a8", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "keyword.control", "storage.type"], settings: { foreground: "#16161a", fontStyle: "bold" } },
    { scope: ["entity.name.function", "support.function", "entity.name.tag"], settings: { foreground: "#16161a" } },
    { scope: ["string", "string.quoted", "constant.other.symbol"], settings: { foreground: "#54545c" } },
    { scope: ["constant.numeric", "constant.language", "variable.other.constant"], settings: { foreground: "#35353c", fontStyle: "bold" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#8a8a92" } },
    { scope: ["variable", "variable.other", "entity.name.type", "support.type"], settings: { foreground: "#35353c" } },
  ],
};

const codeDark = {
  name: "teximos-dark",
  type: "dark",
  fg: "#b4b4bc",
  bg: "#17171b",
  settings: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#5c5c65", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "keyword.control", "storage.type"], settings: { foreground: "#f4f4f6", fontStyle: "bold" } },
    { scope: ["entity.name.function", "support.function", "entity.name.tag"], settings: { foreground: "#e8e8ea" } },
    { scope: ["string", "string.quoted", "constant.other.symbol"], settings: { foreground: "#94949c" } },
    { scope: ["constant.numeric", "constant.language", "variable.other.constant"], settings: { foreground: "#d0d0d8", fontStyle: "bold" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#6e6e78" } },
    { scope: ["variable", "variable.other", "entity.name.type", "support.type"], settings: { foreground: "#b4b4bc" } },
  ],
};

export default defineConfig({
  site: "https://teximos.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: codeLight, dark: codeDark },
    },
  },
});
