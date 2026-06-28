export interface Courtyard {
  slug: string;
  name: string;
  grapevineAgeYears: number;
  gossipRating: number;
  shortLine: string;
  story: string;
  district: string;
}

export interface Apartment {
  slug: string;
  title: string;
  courtyardSlug: string;
  courtyardName: string;
  price: number;
  rooms: number;
  squareMeters: number;
  floor: string;
  grapevineAgeYears: number;
  gossipRating: number;
  courtyardStory: string;
  image: string;
  imageAlt: string;
}

export interface Testimonial {
  name: string;
  quote: string;
  detail: string;
}

export const courtyards: Courtyard[] = [
  {
    slug: "lados",
    name: "Lado's Courtyard",
    grapevineAgeYears: 90,
    gossipRating: 8,
    shortLine: "Loudest table in the district, fiercest at protecting its own.",
    story:
      "Named for the man who planted the vine, gone forty years now, though the courtyard still argues about whether he'd have approved of the new paint. The grapevine here was put in the year after the war and now shades the whole well by August. Neighbors keep a shared ladder, a shared grudge against the upstairs renovation, and a shared table that comes out every Sunday whether you're invited or not, which you are.",
    district: "Sololaki",
  },
  {
    slug: "mzias",
    name: "Mzia's Courtyard",
    grapevineAgeYears: 40,
    gossipRating: 4,
    shortLine: "The gentle well, slow to take you in, slow to let you go.",
    story:
      "Set back from the street, where the loudest sound most days is the piano teacher's students on the third floor. The grapevine is younger than the building, planted by Mzia herself the spring she retired from the conservatory. Neighbors wave; they don't interrogate. Best for someone who wants company within earshot but not within asking distance.",
    district: "Mtatsminda",
  },
  {
    slug: "ramazis",
    name: "Ramaz's Courtyard",
    grapevineAgeYears: 65,
    gossipRating: 6,
    shortLine: "The middle weight — warm welcome, opinions held in reserve.",
    story:
      "A working courtyard with a stairwell cat who answers to three different names depending on which floor is calling. The grapevine is mature but not ancient. There's a Wednesday card game on the ground floor and a Saturday market run that leaves at seven. You'll be invited to both by the second month.",
    district: "Vera",
  },
];

const courtyardBySlug = Object.fromEntries(courtyards.map((c) => [c.slug, c]));

export const apartments: Apartment[] = [
  {
    slug: "grapevine-flat",
    title: "The Grapevine Flat",
    courtyardSlug: "lados",
    courtyardName: courtyardBySlug.lados.name,
    price: 129000,
    rooms: 3,
    squareMeters: 84,
    floor: "2nd floor (the good balcony)",
    grapevineAgeYears: 90,
    gossipRating: 8,
    courtyardStory:
      "A high-ceilinged flat opening onto the carved wooden balcony that rings Lado's Courtyard, where the grapevine planted after the war now shades the whole well by August.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbQpA92-M3PnjZSDwUO0MnZr4RVbMZAGupvcnad6ltlh1KZxsCeZcUp7sgPPbHYzbO1McwqDNXoek2awiIGK4bjk-i8WGbuyLGyCPYvybfQEqBB22qeyuSeEdLIt-8y8CaYJRIfy_kF93vlgrUwSB5tnNE9TCFWpyGrnQFNaOq76bNgOVheZXvhu-4XhcYF_-riHHhCn_Gn36KnI0iwmNy3nXD4opWsDVuIjz6AANQE7n0Xe8FI4fw3ir9MOaxqhljjGK9FtAsySpY",
    imageAlt:
      "Tall French doors open onto a vine-shaded wooden balcony in golden afternoon light.",
  },
  {
    slug: "quiet-corner",
    title: "The Quiet Corner",
    courtyardSlug: "mzias",
    courtyardName: courtyardBySlug.mzias.name,
    price: 98500,
    rooms: 2,
    squareMeters: 61,
    floor: "Ground floor with its own small garden patch",
    grapevineAgeYears: 40,
    gossipRating: 4,
    courtyardStory:
      "A calmer flat in the courtyard everyone calls the gentle one. The elderly piano teacher on the third floor sets the volume for the whole well.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJMJwd8UFY8hI9XcGEYEzNvyP37nFJjo7iBLztZWl62xHseH8AMWKPWrxKWj2YH4PlsA8BBCt752LKUPp6BzOmHZys0ugcxzMWhtiGNSnA_UhwH_H2U8p0GoqSZK5V3gHk2ykTsfVDCTWPp3h9cXGOKT0X03nNTgXyNqjKATHs1p-TNVkRIh7GLdM76frcM1r-XBjBK6O-i4djyFmnxPkmwCui6FPiKORamY3VxSUCoP6WswwOQaBhaLWmHIM-Fw9fLJAxGubtKriE",
    imageAlt:
      "Vine-leaf shadows cast on a warm wooden floor beside an antique chair and stack of books.",
  },
  {
    slug: "shared-ladder",
    title: "The Shared Ladder",
    courtyardSlug: "lados",
    courtyardName: courtyardBySlug.lados.name,
    price: 142000,
    rooms: 3,
    squareMeters: 92,
    floor: "3rd floor, corner with views of the vine canopy",
    grapevineAgeYears: 90,
    gossipRating: 8,
    courtyardStory:
      "Named for the ladder kept in the stairwell, which everyone uses and no one owns. The flat looks straight down into the heart of the table.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV6_KY0IKllcYgcvZXT8P9KHScqTvXHkyw66R1vYH3H3LtSGzCc937KxqsEu1I1Wxmn13kGnJMfW7QH0qqQhWHtM_x6cPXKyUvTPOai7SPU0GIuJCRz71UNg7vCItDd6KaW6NXaLDUwoinZ9S9sSCeK19Ddf7wIQAOergD-lG6jujF9ErkXAG8dbAavfgA5TI8agD18-nxXbNgR0vRUyi91pRw53EFNcl_o3trekr5BzSF50mRFWyMVNiDZBa67R0PJns-EUC3Gp2",
    imageAlt:
      "View from a wooden balcony over a multi-level Tbilisi courtyard with hanging laundry.",
  },
  {
    slug: "piano-window",
    title: "The Piano Window",
    courtyardSlug: "mzias",
    courtyardName: courtyardBySlug.mzias.name,
    price: 116000,
    rooms: 2,
    squareMeters: 70,
    floor: "1st floor, two arched windows onto the well",
    grapevineAgeYears: 40,
    gossipRating: 4,
    courtyardStory:
      "Two south-facing arched windows; you'll hear Mzia's old students every afternoon, mostly Chopin, occasionally Bartók when the brave ones come around.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8qKrTe3j0SjCErG_QJD_UiVRh1YTSY7VV84mXzJdy7QN9Ml2RtYXK_uZRzQ8R5GJLfEKZZesVQuP7suFT-VIdI34qbxzdJgiy-MHN4EMSm72xo91un2YnlfIJ-u4QU060Yo4KVLwqPp0zQOq_GoFXsLvjQeFyWFgf1BGJ7iRJMFgaSFpyFfB1KGLtmDheYOaHLFUf-r8SjckUKZ0DCu7P4YJl_-EYBIIJS7wY5gkIESQSAelFhebErIfM6o4yAAnT08v2AZE85AuA",
    imageAlt:
      "A heavy turquoise wooden door in an aged brick wall, sunlight catching dust motes.",
  },
  {
    slug: "stairwell-cat",
    title: "The Stairwell Cat",
    courtyardSlug: "ramazis",
    courtyardName: courtyardBySlug.ramazis.name,
    price: 109500,
    rooms: 2,
    squareMeters: 58,
    floor: "2nd floor, off the spiral stairwell",
    grapevineAgeYears: 65,
    gossipRating: 6,
    courtyardStory:
      "Named for the cat that owns the spiral staircase here and the bowl that's always full thanks to whichever neighbor remembered first.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVgQXYQKJG2g5FRZ6HWRIQQOnvVUNsBqdzBC3C7DlSSEioSRCG5he9RAzmzfYO4wAhCWUOux2kq0Z-c3YBoDPf3zZlKwjiRlo9DufJZKGE-IBtsBfeGJZsx3h28vyszmuHHpmmwqPobPVF8hhI_kJt9-ZJ22sngrVYVPeqwie7R7Til7TOGx_IRsIwwRrauguVUQTVg1UYqPkNFxUEXFQWDycavk1l6ng9fQiWC9Or2f8bsZrLFk2jUHTC_KezDq6rpKeUsZerMN3W",
    imageAlt:
      "An ornate wrought-iron spiral staircase winds up through green ivy in late afternoon light.",
  },
  {
    slug: "long-table",
    title: "The Long Table",
    courtyardSlug: "ramazis",
    courtyardName: courtyardBySlug.ramazis.name,
    price: 154000,
    rooms: 4,
    squareMeters: 105,
    floor: "Ground floor opening directly onto the courtyard",
    grapevineAgeYears: 65,
    gossipRating: 6,
    courtyardStory:
      "The flat whose terrace becomes part of the courtyard when the long table comes out for Saturday lunch, which is most Saturdays.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVjuugT66r7Kj9MrXo6YbhO4K2iln6w7tqkMhuOvxrM2L9yKkbeUAkmvlzcLb03ZcYXERW5bK8_34RVY6LKP5WWQ6a5U-zpQ4caQXShEd1NKwFmbTa8gCj0jVBB0CaXHLlIr6L8MVmTUu-73uN4w0dGMYfO_5w1RxAEpoMGYIKuAsXdChjAOGr9ppueTLpB3W5jBmyt7zYWMF3xoX5AFAj21KPTcoB9MyLsRkn5XEeajROQ659bmF7X5fN_Oim3JUFd6gAVPvVHuk7",
    imageAlt:
      "A long weathered table under a canopy of grapevines, mismatched chairs around it, golden hour light.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Nino Abashidze",
    quote:
      "I came to look at a two-room flat and left having promised to bring khachapuri to a Sunday I hadn't been invited to yet.",
    detail: "Bought into Lado's Courtyard, now keeps the shared ladder.",
  },
  {
    name: "Tomas Reuben",
    quote:
      "They made me sit in the courtyard for an hour before they'd show me the paperwork. By the time I signed, three neighbors knew my coffee order.",
    detail: "Relocated from Berlin to Mzia's Courtyard.",
  },
  {
    name: "Sopho Khelaia",
    quote:
      "The collective isn't about real estate. It's about opting back into a kind of neighboring most cities forgot how to do.",
    detail: "Returned from Toronto to Ramaz's Courtyard.",
  },
];

export const faqs = [
  {
    q: "Do I really have to meet the neighbors before I buy?",
    a: "Yes, and it's the best part. We arrange a sit-down in the courtyard before any contract talk. You'll know who's loud, who's kind, and who keeps the shared table before you ever see the notary.",
  },
  {
    q: "What's a 'gossip rating'?",
    a: "Our honest read on how chatty a courtyard is, scored one to ten. A four means neighbors wave and mind their own; an eight means they'll know you switched coffee brands by Tuesday. Neither is wrong, but you should pick on purpose.",
  },
  {
    q: "Can foreigners buy property in Tbilisi through you?",
    a: "In most cases, yes. Georgia allows foreign nationals to buy apartments, and we walk you through the notary process step by step. We're an agency, not a law firm, so we'll point you to a local lawyer for anything binding.",
  },
  {
    q: "What does the price include?",
    a: "The listed price is for the apartment itself. Shared courtyard spaces, the grapevine, and the Sunday table aren't for sale — they come with belonging, not money. We're clear about any building fees before you commit.",
  },
  {
    q: "Why sell apartments by their courtyard instead of by the flat?",
    a: "Because the courtyard is the thing you actually live inside. The flat is where you sleep; the courtyard is where you're known. Selling them as communities is the only honest way we've found to do this.",
  },
  {
    q: "How long does the whole process take?",
    a: "From first courtyard visit to signing usually runs three to six weeks, depending on how fast the neighbors take to you and how fast your paperwork moves. We never rush the introduction.",
  },
];

export const aboutStory = {
  heading: "We started selling courtyards because we kept selling the wrong thing.",
  body:
    "The Courtyard Collective began when two of us, both raised in Tbilisi's Italian courtyards, watched flat after flat get sold by the square meter to buyers who never met the people they'd share a stairwell with for the next thirty years. It went badly more often than it should have. So we changed the order of things. Now nobody buys through us until they've sat in the courtyard, met the neighbors, and been handed at least one glass of something. We catalog each courtyard the way others catalog kitchens: the age of the grapevine, the temperature of the gossip, who keeps the shared table and who's allowed near it. We're not selling you privacy. We're selling you the opposite, and we want you to be sure you want it before the notary does.",
};

export const formatPrice = (n: number) =>
  "$" + n.toLocaleString("en-US");
