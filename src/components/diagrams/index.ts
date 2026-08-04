import MissingPrice from "./MissingPrice.astro";

/**
 * Frontmatter `diagram` selects from this map. An unknown or absent name
 * resolves to null and the page renders without a figure, rather than failing
 * the build, so a draft without artwork is still publishable.
 */
export const DIAGRAMS: Record<string, unknown> = {
  MissingPrice,
};

export function getDiagram(name?: string) {
  if (!name) return null;
  return DIAGRAMS[name] ?? null;
}
