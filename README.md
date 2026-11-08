# Body Bazzare Tattoo & Piercing

Independent website concept for owner review, not the business’s official website.

## Vercel configuration
Import this repository, use Framework Preset **Other**, leave install/build commands empty, and select **dist** as output directory. `vercel.json` supplies these settings. No dependencies or environment variables are required.

Edit the static HTML, CSS and JavaScript in `dist/`.

## Latest refresh
Artwork-led cream and blue-green editorial layout, service navigation, a selected-work gallery, clearer consultation planning, updated contact email and responsive layout refinements. The gallery supports Previous/Next, arrow keys, Escape, focus restoration and ordinary image-link fallback without JavaScript.

One additional moon-and-rose photo is attributed to @bodybazzare by a third-party article. It was not obtained directly from Instagram; original post and commercial licensing remain unverified. See `SOURCES.md`.

## Checks
- `node --check dist/gallery.js`
- `node --test tests/gallery.test.cjs`
- `python tests/check_site.py`

The interaction checks use a simulated DOM, not a real browser. Local Chromium launch was blocked by the execution environment’s socket permissions; rendered desktop/mobile layout and native browser focus behavior have not been visually verified. There is no build step or test dependency.

## Before official launch
Keep staging noindex metadata until owner approval. Confirm hours, current staff/services, the user-supplied Yahoo address and rights to all photos. Public availability does not provide commercial reuse permission. Reviews are attributed excerpts, not a live feed.
