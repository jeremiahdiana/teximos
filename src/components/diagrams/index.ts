import MissingPrice from "./MissingPrice.astro";
import WrongBaseline from "./WrongBaseline.astro";
import TransactionRetry from "./TransactionRetry.astro";
import SpellingConstraint from "./SpellingConstraint.astro";
import OrphanSignature from "./OrphanSignature.astro";
import MissingDoc from "./MissingDoc.astro";

/**
 * Frontmatter `diagram` selects from this map. An unknown or absent name
 * resolves to null and the page renders without a figure, rather than failing
 * the build, so a draft without artwork is still publishable.
 */
export const DIAGRAMS: Record<string, unknown> = {
  MissingPrice,
  WrongBaseline,
  TransactionRetry,
  SpellingConstraint,
  OrphanSignature,
  MissingDoc,
};

export function getDiagram(name?: string) {
  if (!name) return null;
  return DIAGRAMS[name] ?? null;
}
