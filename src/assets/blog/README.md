Images for articles.

Put a real image here, then reference it from an article's frontmatter as a
cover, or import it into the body:

    cover: ../../assets/blog/thing.png
    coverAlt: "What is in the picture"

    import Shot from "../../components/Shot.astro";
    import thing from "../../assets/blog/thing.png";

    <Shot src={thing} alt="..." caption="..." wide />

Anything in here goes through Astro's build-time pipeline: resized, converted
to webp, given a srcset and intrinsic dimensions. Nothing ships to the browser
that was not asked for, and no JavaScript is added.

A `cover` wins over a `diagram` when both are set. Use a drawn figure when the
thesis IS a shape. Use a real image when the actual thing is worth showing.
