# The Courtyard Collective

> Tbilisi apartments sold by their courtyards. Buyers meet the neighbors before the notary.

A small editorial real-estate site built for [HEADLESS DAY](https://headlessday.wix.com) brief **spec-0319** — a fictional Tbilisi agency selling apartments in the city's Italian courtyards as communities, not square meters. Each courtyard ships with a published grapevine age and gossip rating.

**Live:** https://the-courty-b72a01c9-kerensa13.wix-site-host.com

## Stack

- **[Astro 5](https://astro.build)** with server output, deployed via the Wix runtime fetch adapter
- **[Wix Headless](https://www.wix.com/studio/developers/headless)** for hosting + CMS (`@wix/data`)
- **React** islands for the inquiry form
- **Tailwind v4** for styling (single `@theme` block, no config file)
- **Instrument Serif** + **Source Serif 4**, self-hosted via `@fontsource`
- **TypeScript** end-to-end

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero, six listings, courtyard personalities, voices, process band, dark CTA |
| `/courtyards` | All six apartments in an asymmetric editorial grid |
| `/communities` | Three courtyard profiles with story + personality card |
| `/meet-the-neighbors` | Five-step process timeline |
| `/inquire` | Buyer inquiry form (React island) + FAQ accordion |
| `/about` | The collective's story + "how we vet a welcome" |
| `/api/inquire` | POST endpoint that persists inquiries to Wix Data |

## Signature device

A "Courtyard Personality Card" that recurs across every listing and profile. The hand-drawn grapevine SVG's tendril length encodes `grapevineAgeYears`; the gossip rating is shown as a 10-dot meter. Implementation: [`src/components/GrapevineTendril.astro`](src/components/GrapevineTendril.astro) and [`src/components/GossipMeter.astro`](src/components/GossipMeter.astro).

## Content layer

Read pages query Wix Data first, then fall back to static spec content when the collection isn't yet provisioned. See [`src/lib/wix.ts`](src/lib/wix.ts) and [`src/data/content.ts`](src/data/content.ts).

Four CMS collections:

| Collection | Purpose | Insert perm |
|---|---|---|
| `Apartments` | Six available flats | `ADMIN` |
| `Courtyards` | Three communities | `ADMIN` |
| `Testimonials` | Three voices | `ADMIN` |
| `Inquiries` | Buyer form submissions | `ANYONE` |

## Local development

```bash
npm install
wix login              # or: wix login --api-key <token>
wix env pull           # populates .env.local with OAuth client creds
npm run dev
```

The dev server runs at http://localhost:4321.

## Provisioning the CMS (optional)

The site works without CMS thanks to the static fallback — but to drive content from Wix Data:

1. Generate an API key at https://manage.wix.com/account/api-keys with **Wix Data — Manage Data Items + Manage Data Collections** scopes.
2. `wix env set --key WIX_API_KEY --value <key>`
3. `node scripts/seed-cms.mjs` — creates all 4 collections with the right schema and inserts every row from the spec.

After that, the read pages will automatically start serving from Wix Data on next request.

## Build & release

```bash
npm run build          # wix build (server bundle)
wix release            # publishes to *.wix-site-host.com
```

## Project shape

```
src/
  components/          # 9 reusable .astro / .tsx components
    GrapevineTendril.astro     # the signature SVG vine
    CourtyardPersonalityCard.astro
    ListingCard.astro
    BuyerInquiryForm.tsx       # React island, client:idle
    Nav.astro / Footer.astro / MobileStickyBar.astro
    ...
  data/content.ts      # static spec content (typed + exportable)
  layouts/Layout.astro # shared <head>, JSON-LD, nav/footer composition
  lib/wix.ts           # @wix/data wrapper with CMS-or-static fallback
  pages/               # 6 routes + /api/inquire
  styles/global.css    # tailwind @theme + design tokens + gossip-meter CSS
scripts/seed-cms.mjs   # one-shot CMS bootstrapper (needs WIX_API_KEY)
```

## Brief compliance

Every requirement from the HEADLESS DAY brief:

- [x] Listings page with 6 courtyard apartments and prices — `/courtyards`
- [x] Courtyard profiles describing each community — `/communities`
- [x] Meet-the-neighbors process page — `/meet-the-neighbors`
- [x] Buyer inquiry form — `/inquire`, React island posting to `/api/inquire`
- [x] Mobile-first responsive design — sticky inquiry bar, stacked editorial spreads
- [x] Bonus: courtyard personality card with grapevine age and gossip rating

Plus the brief's softer asks: `RealEstateAgent` / `Residence` / `FAQPage` JSON-LD, semantic landmarks, AA contrast, 44px tap targets, `prefers-reduced-motion` honoured.

## License

Made for HEADLESS DAY. Use the structure however you like.
