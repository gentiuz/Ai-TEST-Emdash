# Gent Ford — Coaching for Men

EmDash 1.5, Astro 7, Cloudflare Workers + D1 + R2. Worker: `gentford-2`. Intended domain: `test2.gentford.com`.

## Develop

Node 24 is recommended (EmDash requires Node >=22.16).

```sh
npm ci
npm run dev
```

In restricted cloud environments set `npm_config_cache=/workspace/.npm-cache`, `XDG_CONFIG_HOME=/workspace/.config`, and `XDG_CACHE_HOME=/workspace/.cache`. Use the existing checkout; tasks are already isolated and do not need another worktree.

The admin is at `/_emdash/admin`. For **local development only**, visit `/_emdash/api/setup/dev-bypass?content=1&redirect=/_emdash/admin` once. This creates the local dev administrator and loads the demo content. This bypass is forbidden in production. Local content lives in ignored `.wrangler/state`; do not commit it.

## Content and design

- **Content model and initial copy:** `seed/seed.json`. Nine pages, CMS navigation menus, eleven standard marketing block types and a demo form block. The seed does not overwrite existing content. Edit seeded pages in the admin; changing a seed is not a content migration.
- **Design:** `src/styles/theme.css`, with base tokens in `tokens.css`. Fonts are self-hosted npm assets. Shared structure lives in `src/layouts/Base.astro`; block renderers are in `src/components/blocks/`.
- **Features:** EmDash runtime, live collections and plugin contribution slots remain independent of the theme. Keep block type/version identifiers when restyling. Do not replace CMS queries with hardcoded page copy.
- **Forms:** the reusable demo form deliberately has no backend or named form values. It validates locally and confirms that nothing was submitted. With JavaScript disabled it cannot transmit data.
- **SEO:** server-rendered pages, editable SEO fields, canonical URLs, Open Graph/Twitter metadata, branded social JPEG, WebSite/WebPage/Person/Service/BreadcrumbList schema, FAQ schema matching visible FAQ content, EmDash sitemap and robots, optional `llms.txt`. These aid discovery; they cannot guarantee search or AI inclusion. In public test deployments this content is crawlable; change the site's SEO visibility settings if a private test is wanted.

## Verify

```sh
npm run check
npm run build
npm test
```

Browser tests expect a running local server with seeded content and Chromium at `/usr/bin/chromium`. Override the executable in `playwright.config.ts` for another machine. Tests cover all page responses and metadata, local-only form behaviour, mobile navigation, theme persistence, and representative light/dark WCAG accessibility checks. Screenshots are written to ignored `artifacts/`.

## Deploy

1. Authenticate Wrangler using a securely configured Cloudflare API token. It needs Workers Scripts edit, D1 edit, R2 edit, and permissions for Workers custom domains on the `gentford.com` zone. Set `CLOUDFLARE_ACCOUNT_ID` if the token can access multiple accounts.
2. `npm run deploy` builds and deploys only `gentford-2`. Wrangler can provision the named D1 and R2 resources from `wrangler.jsonc`; retain any resulting IDs in config. Ensure R2 is enabled and `gentford.com` is in this Cloudflare account. Do not modify existing Gent Ford Workers.
3. Open `https://test2.gentford.com/_emdash/admin/setup`, create the real owner account with a passkey, and **include sample content** to load the coaching pages. Do not publish an unclaimed setup wizard publicly: complete owner setup promptly and restrict access while setting it up.
4. Check each page, sitemap, forms, image loading, and sign-in over HTTPS.

A manual GitHub Actions workflow is included. Add repository/environment secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run **Deploy Gent Ford 2**. Cloud environment secret bindings are separate from GitHub Actions secrets. No automatic deployment on push is enabled.

## Photos and test content

Stock image sources (licensing and depicted identity must be verified before replacing demo content with a real professional profile):

- Portrait candidate: https://www.pexels.com/photo/man-in-black-suit-jacket-834863/ — test illustration, not a verified photograph of Gentius Ford. Exact age is not asserted.
- Landscape: https://unsplash.com/photos/photo-1470770841072-f978cf4d019e (image source ID; see seed URL).

The cloud network must permit `images.pexels.com` and `images.unsplash.com` to verify these assets. Photos currently remain external image references. Copy verified photos into the EmDash media library for durable ownership and optimisation. Terms and Privacy describe a demonstration, not a live coaching contract; real business details and service terms must be supplied before selling services.

No credentials, testimonials, qualifications, client counts, or performance guarantees are invented.
