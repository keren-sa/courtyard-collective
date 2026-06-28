/* Seed the Wix CMS collections for The Courtyard Collective.
   Uses the CLI session token (npx wix token) for admin auth — no API key required.
   Run: node scripts/seed-cms.mjs */

import { execSync } from "node:child_process";
import { createClient } from "@wix/sdk";
import { collections, items } from "@wix/data";

function readWixConfig() {
  return JSON.parse(execSync("cat wix.config.json", { encoding: "utf8" }));
}

function getCliToken() {
  return execSync("npx wix token", { encoding: "utf8" }).trim();
}

const { siteId } = readWixConfig();
const token = getCliToken();
console.log(`Using siteId=${siteId}, token starts: ${token.slice(0, 24)}…`);

// Custom auth strategy that uses the Wix CLI token directly
const cliAuth = {
  async getAuthHeaders() {
    return {
      headers: {
        Authorization: token,
        "wix-site-id": siteId,
      },
    };
  },
};

const wix = createClient({
  modules: { collections, items },
  auth: cliAuth,
});

const T = { TEXT: "TEXT", NUMBER: "NUMBER", URL: "URL", DATETIME: "DATETIME", RICH_TEXT: "RICH_TEXT" };

const COLLECTIONS = [
  {
    id: "Apartments",
    displayName: "Apartments",
    fields: [
      { key: "slug", displayName: "Slug", type: T.TEXT },
      { key: "title", displayName: "Title", type: T.TEXT },
      { key: "courtyardSlug", displayName: "Courtyard slug", type: T.TEXT },
      { key: "courtyardName", displayName: "Courtyard name", type: T.TEXT },
      { key: "price", displayName: "Price (USD)", type: T.NUMBER },
      { key: "rooms", displayName: "Rooms", type: T.NUMBER },
      { key: "squareMeters", displayName: "Square meters", type: T.NUMBER },
      { key: "floor", displayName: "Floor", type: T.TEXT },
      { key: "grapevineAgeYears", displayName: "Grapevine age (yrs)", type: T.NUMBER },
      { key: "gossipRating", displayName: "Gossip rating", type: T.NUMBER },
      { key: "courtyardStory", displayName: "Story", type: T.TEXT },
      { key: "image", displayName: "Image URL", type: T.URL },
      { key: "imageAlt", displayName: "Image alt", type: T.TEXT },
      { key: "order", displayName: "Display order", type: T.NUMBER },
    ],
  },
  {
    id: "Courtyards",
    displayName: "Courtyards",
    fields: [
      { key: "slug", displayName: "Slug", type: T.TEXT },
      { key: "name", displayName: "Name", type: T.TEXT },
      { key: "district", displayName: "District", type: T.TEXT },
      { key: "grapevineAgeYears", displayName: "Grapevine age (yrs)", type: T.NUMBER },
      { key: "gossipRating", displayName: "Gossip rating", type: T.NUMBER },
      { key: "shortLine", displayName: "Short line", type: T.TEXT },
      { key: "story", displayName: "Story", type: T.TEXT },
      { key: "order", displayName: "Display order", type: T.NUMBER },
    ],
  },
  {
    id: "Testimonials",
    displayName: "Testimonials",
    fields: [
      { key: "name", displayName: "Name", type: T.TEXT },
      { key: "quote", displayName: "Quote", type: T.TEXT },
      { key: "detail", displayName: "Detail", type: T.TEXT },
      { key: "order", displayName: "Display order", type: T.NUMBER },
    ],
  },
  {
    id: "Inquiries",
    displayName: "Inquiries",
    fields: [
      { key: "name", displayName: "Name", type: T.TEXT },
      { key: "email", displayName: "Email", type: T.TEXT },
      { key: "phone", displayName: "Phone", type: T.TEXT },
      { key: "apartmentOrCourtyardOfInterest", displayName: "Interest", type: T.TEXT },
      { key: "howYouLikeToLive", displayName: "How you like to live", type: T.TEXT },
      { key: "timeline", displayName: "Timeline", type: T.TEXT },
      { key: "submittedAt", displayName: "Submitted at", type: T.DATETIME },
    ],
  },
];

const courtyards = [
  { slug: "lados", name: "Lado's Courtyard", grapevineAgeYears: 90, gossipRating: 8, shortLine: "Loudest table in the district, fiercest at protecting its own.", story: "Named for the man who planted the vine, gone forty years now, though the courtyard still argues about whether he'd have approved of the new paint. The grapevine here was put in the year after the war and now shades the whole well by August. Neighbors keep a shared ladder, a shared grudge against the upstairs renovation, and a shared table that comes out every Sunday whether you're invited or not, which you are.", district: "Sololaki" },
  { slug: "mzias", name: "Mzia's Courtyard", grapevineAgeYears: 40, gossipRating: 4, shortLine: "The gentle well, slow to take you in, slow to let you go.", story: "Set back from the street, where the loudest sound most days is the piano teacher's students on the third floor. The grapevine is younger than the building, planted by Mzia herself the spring she retired from the conservatory. Neighbors wave; they don't interrogate. Best for someone who wants company within earshot but not within asking distance.", district: "Mtatsminda" },
  { slug: "ramazis", name: "Ramaz's Courtyard", grapevineAgeYears: 65, gossipRating: 6, shortLine: "The middle weight — warm welcome, opinions held in reserve.", story: "A working courtyard with a stairwell cat who answers to three different names depending on which floor is calling. The grapevine is mature but not ancient. There's a Wednesday card game on the ground floor and a Saturday market run that leaves at seven. You'll be invited to both by the second month.", district: "Vera" },
];

const apartments = [
  { slug: "grapevine-flat", title: "The Grapevine Flat", courtyardSlug: "lados", courtyardName: "Lado's Courtyard", price: 129000, rooms: 3, squareMeters: 84, floor: "2nd floor (the good balcony)", grapevineAgeYears: 90, gossipRating: 8, courtyardStory: "A high-ceilinged flat opening onto the carved wooden balcony that rings Lado's Courtyard, where the grapevine planted after the war now shades the whole well by August.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbQpA92-M3PnjZSDwUO0MnZr4RVbMZAGupvcnad6ltlh1KZxsCeZcUp7sgPPbHYzbO1McwqDNXoek2awiIGK4bjk-i8WGbuyLGyCPYvybfQEqBB22qeyuSeEdLIt-8y8CaYJRIfy_kF93vlgrUwSB5tnNE9TCFWpyGrnQFNaOq76bNgOVheZXvhu-4XhcYF_-riHHhCn_Gn36KnI0iwmNy3nXD4opWsDVuIjz6AANQE7n0Xe8FI4fw3ir9MOaxqhljjGK9FtAsySpY", imageAlt: "Tall French doors open onto a vine-shaded wooden balcony in golden afternoon light." },
  { slug: "quiet-corner", title: "The Quiet Corner", courtyardSlug: "mzias", courtyardName: "Mzia's Courtyard", price: 98500, rooms: 2, squareMeters: 61, floor: "Ground floor with its own small garden patch", grapevineAgeYears: 40, gossipRating: 4, courtyardStory: "A calmer flat in the courtyard everyone calls the gentle one. The elderly piano teacher on the third floor sets the volume for the whole well.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJMJwd8UFY8hI9XcGEYEzNvyP37nFJjo7iBLztZWl62xHseH8AMWKPWrxKWj2YH4PlsA8BBCt752LKUPp6BzOmHZys0ugcxzMWhtiGNSnA_UhwH_H2U8p0GoqSZK5V3gHk2ykTsfVDCTWPp3h9cXGOKT0X03nNTgXyNqjKATHs1p-TNVkRIh7GLdM76frcM1r-XBjBK6O-i4djyFmnxPkmwCui6FPiKORamY3VxSUCoP6WswwOQaBhaLWmHIM-Fw9fLJAxGubtKriE", imageAlt: "Vine-leaf shadows cast on a warm wooden floor beside an antique chair and stack of books." },
  { slug: "shared-ladder", title: "The Shared Ladder", courtyardSlug: "lados", courtyardName: "Lado's Courtyard", price: 142000, rooms: 3, squareMeters: 92, floor: "3rd floor, corner with views of the vine canopy", grapevineAgeYears: 90, gossipRating: 8, courtyardStory: "Named for the ladder kept in the stairwell, which everyone uses and no one owns. The flat looks straight down into the heart of the table.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV6_KY0IKllcYgcvZXT8P9KHScqTvXHkyw66R1vYH3H3LtSGzCc937KxqsEu1I1Wxmn13kGnJMfW7QH0qqQhWHtM_x6cPXKyUvTPOai7SPU0GIuJCRz71UNg7vCItDd6KaW6NXaLDUwoinZ9S9sSCeK19Ddf7wIQAOergD-lG6jujF9ErkXAG8dbAavfgA5TI8agD18-nxXbNgR0vRUyi91pRw53EFNcl_o3trekr5BzSF50mRFWyMVNiDZBa67R0PJns-EUC3Gp2", imageAlt: "View from a wooden balcony over a multi-level Tbilisi courtyard with hanging laundry." },
  { slug: "piano-window", title: "The Piano Window", courtyardSlug: "mzias", courtyardName: "Mzia's Courtyard", price: 116000, rooms: 2, squareMeters: 70, floor: "1st floor, two arched windows onto the well", grapevineAgeYears: 40, gossipRating: 4, courtyardStory: "Two south-facing arched windows; you'll hear Mzia's old students every afternoon, mostly Chopin, occasionally Bartók when the brave ones come around.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8qKrTe3j0SjCErG_QJD_UiVRh1YTSY7VV84mXzJdy7QN9Ml2RtYXK_uZRzQ8R5GJLfEKZZesVQuP7suFT-VIdI34qbxzdJgiy-MHN4EMSm72xo91un2YnlfIJ-u4QU060Yo4KVLwqPp0zQOq_GoFXsLvjQeFyWFgf1BGJ7iRJMFgaSFpyFfB1KGLtmDheYOaHLFUf-r8SjckUKZ0DCu7P4YJl_-EYBIIJS7wY5gkIESQSAelFhebErIfM6o4yAAnT08v2AZE85AuA", imageAlt: "A heavy turquoise wooden door in an aged brick wall, sunlight catching dust motes." },
  { slug: "stairwell-cat", title: "The Stairwell Cat", courtyardSlug: "ramazis", courtyardName: "Ramaz's Courtyard", price: 109500, rooms: 2, squareMeters: 58, floor: "2nd floor, off the spiral stairwell", grapevineAgeYears: 65, gossipRating: 6, courtyardStory: "Named for the cat that owns the spiral staircase here and the bowl that's always full thanks to whichever neighbor remembered first.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVgQXYQKJG2g5FRZ6HWRIQQOnvVUNsBqdzBC3C7DlSSEioSRCG5he9RAzmzfYO4wAhCWUOux2kq0Z-c3YBoDPf3zZlKwjiRlo9DufJZKGE-IBtsBfeGJZsx3h28vyszmuHHpmmwqPobPVF8hhI_kJt9-ZJ22sngrVYVPeqwie7R7Til7TOGx_IRsIwwRrauguVUQTVg1UYqPkNFxUEXFQWDycavk1l6ng9fQiWC9Or2f8bsZrLFk2jUHTC_KezDq6rpKeUsZerMN3W", imageAlt: "An ornate wrought-iron spiral staircase winds up through green ivy in late afternoon light." },
  { slug: "long-table", title: "The Long Table", courtyardSlug: "ramazis", courtyardName: "Ramaz's Courtyard", price: 154000, rooms: 4, squareMeters: 105, floor: "Ground floor opening directly onto the courtyard", grapevineAgeYears: 65, gossipRating: 6, courtyardStory: "The flat whose terrace becomes part of the courtyard when the long table comes out for Saturday lunch, which is most Saturdays.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVjuugT66r7Kj9MrXo6YbhO4K2iln6w7tqkMhuOvxrM2L9yKkbeUAkmvlzcLb03ZcYXERW5bK8_34RVY6LKP5WWQ6a5U-zpQ4caQXShEd1NKwFmbTa8gCj0jVBB0CaXHLlIr6L8MVmTUu-73uN4w0dGMYfO_5w1RxAEpoMGYIKuAsXdChjAOGr9ppueTLpB3W5jBmyt7zYWMF3xoX5AFAj21KPTcoB9MyLsRkn5XEeajROQ659bmF7X5fN_Oim3JUFd6gAVPvVHuk7", imageAlt: "A long weathered table under a canopy of grapevines, mismatched chairs around it, golden hour light." },
];

const testimonials = [
  { name: "Nino Abashidze", quote: "I came to look at a two-room flat and left having promised to bring khachapuri to a Sunday I hadn't been invited to yet.", detail: "Bought into Lado's Courtyard, now keeps the shared ladder." },
  { name: "Tomas Reuben", quote: "They made me sit in the courtyard for an hour before they'd show me the paperwork. By the time I signed, three neighbors knew my coffee order.", detail: "Relocated from Berlin to Mzia's Courtyard." },
  { name: "Sopho Khelaia", quote: "The collective isn't about real estate. It's about opting back into a kind of neighboring most cities forgot how to do.", detail: "Returned from Toronto to Ramaz's Courtyard." },
];

async function ensureCollection(def) {
  try {
    const existing = await wix.collections.getDataCollection(def.id);
    if (existing) {
      console.log(`✓ Collection "${def.id}" already exists.`);
      return;
    }
  } catch {}

  console.log(`+ Creating "${def.id}"…`);
  try {
    await wix.collections.createDataCollection({
      _id: def.id,
      displayName: def.displayName,
      fields: def.fields,
      permissions: {
        read: "ANYONE",
        insert: def.id === "Inquiries" ? "ANYONE" : "ADMIN",
        update: "ADMIN",
        remove: "ADMIN",
      },
    });
    console.log(`  done.`);
  } catch (err) {
    const code = err?.details?.applicationError?.code ?? err?.status;
    console.error(`  failed (${code}):`, err?.message?.slice(0, 200) ?? err);
    throw err;
  }
}

async function seedItems(collectionId, list) {
  console.log(`> Seeding ${list.length} items into ${collectionId}…`);
  for (const item of list) {
    try {
      await wix.items.insert({
        dataCollectionId: collectionId,
        dataItem: { data: item },
      });
      process.stdout.write(".");
    } catch (err) {
      process.stdout.write("x");
      console.error(`\n   failed: ${err?.message?.slice(0, 200) ?? err}`);
    }
  }
  process.stdout.write("\n");
}

async function main() {
  for (const c of COLLECTIONS) {
    await ensureCollection(c);
  }
  await seedItems("Courtyards", courtyards.map((c, i) => ({ ...c, order: i })));
  await seedItems("Apartments", apartments.map((a, i) => ({ ...a, order: i })));
  await seedItems("Testimonials", testimonials.map((t, i) => ({ ...t, order: i })));
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err?.message ?? err);
  process.exit(1);
});
