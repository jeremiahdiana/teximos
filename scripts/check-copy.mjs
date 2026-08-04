#!/usr/bin/env node
/**
 * House style, enforced rather than remembered.
 *
 * Hard failures (exit 1): em dash, en dash, emoji. These are exact, so they
 * block the build.
 *
 * Warnings (exit 0): the Oxford comma. Detecting one needs to know whether the
 * clause after "and" is a list item or a full clause, which a regex cannot do.
 * So this reports candidates for a human to read instead of failing on them.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIRS = ["src/content", "src/pages", "src/layouts", "src/components"];
const EXTS = new Set([".md", ".mdx", ".astro", ".html"]);

// Unicode counts the copyright, registered and trademark signs as
// Extended_Pictographic. They are typography, not emoji, so they are allowed.
const TYPOGRAPHIC = /[©®™]/gu;

const BANNED = [
  { name: "em dash", re: /—/g, fix: "use a full stop, a colon, or brackets" },
  { name: "en dash", re: /–/g, fix: "use 'to' for ranges, a hyphen otherwise" },
  {
    name: "emoji",
    re: /\p{Extended_Pictographic}/gu,
    fix: "delete it",
    strip: TYPOGRAPHIC,
  },
];

const OXFORD = /,\s+(and|or)\s+/g;

async function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out; // directory not created yet, which is fine
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p));
    else if (EXTS.has(extname(e.name))) out.push(p);
  }
  return out;
}

const files = (await Promise.all(DIRS.map((d) => walk(join(ROOT, d))))).flat();

const errors = [];
const warnings = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const lines = (await readFile(file, "utf8")).split("\n");

  lines.forEach((line, i) => {
    for (const rule of BANNED) {
      const subject = rule.strip ? line.replace(rule.strip, "") : line;
      rule.re.lastIndex = 0;
      if (rule.re.test(subject)) {
        errors.push({ rel, n: i + 1, rule: rule.name, fix: rule.fix, line: line.trim() });
      }
    }
    OXFORD.lastIndex = 0;
    if (OXFORD.test(line)) {
      warnings.push({ rel, n: i + 1, line: line.trim() });
    }
  });
}

const cut = (s) => (s.length > 92 ? s.slice(0, 92) + "..." : s);

if (warnings.length) {
  console.log(`\ncheck-copy: ${warnings.length} comma candidate(s) to read yourself`);
  for (const w of warnings) {
    console.log(`  ${w.rel}:${w.n}  ${cut(w.line)}`);
  }
  console.log("  (a serial comma is banned. a comma before a full clause is fine.)");
}

if (errors.length) {
  console.error(`\ncheck-copy: ${errors.length} banned character(s)\n`);
  for (const e of errors) {
    console.error(`  ${e.rel}:${e.n}  ${e.rule}  ->  ${e.fix}`);
    console.error(`      ${cut(e.line)}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`check-copy: clean across ${files.length} file(s)`);
