import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      // The kicker above each headline. Names the subject, not the author.
      topic: z.string().default("Engineering"),
      // Selects a figure from src/components/diagrams. Unknown or absent just
      // means the piece runs without artwork.
      diagram: z.string().optional(),
      /*
       * A real image, as an alternative to a drawn figure. A hand-authored
       * diagram is right for a piece whose thesis IS a shape, and wrong for a
       * piece about a release or a comparison, where the actual thing is worth
       * showing. `cover` wins over `diagram` wherever both are set.
       *
       * image() runs it through Astro's build-time pipeline, so it is resized,
       * given width and height to stop layout shift, and still ships no
       * JavaScript. Path is relative to this file's article.
       */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
