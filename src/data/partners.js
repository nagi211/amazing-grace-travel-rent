// Partner businesses we cross-refer with (venues now, could expand to
// catering/photography/etc. later — the grid groups by category.id
// automatically, so adding a new category is just adding data here).
export const partnerCategories = [{ id: "venue", label: "Venues" }];

export const partners = [
  {
    id: "lpn-farm",
    category: "venue",
    name: "LPN Farm",
    tagline: "Where Love Grows Naturally",
    location: "Oahu, Hawaii",
    description:
      "A private farm and garden venue surrounded by lush greenery, a working dragon fruit farm, and fruit-bearing trees — a natural, scenic, and relaxed setting for everything from intimate elopements to grand celebrations, with sweeping ocean views from the open lawn.",
    highlights: [
      "Lush farm & orchard grounds",
      "Dragon fruit farm & fruit-bearing trees",
      "Private bridal suite",
      "Private groom's suite",
      "On-site guest parking",
      "Beautiful photo locations throughout the property",
    ],
    packages: [
      { name: "Just The Two of Us", type: "Elopement", guests: "Up to 8 guests" },
      { name: "Intimate Aloha", type: "Micro Wedding", guests: "Up to 25 guests" },
      { name: "Garden Romance", type: "Small Wedding", guests: "Up to 50 guests" },
      { name: "Orchard Celebration", type: "Wedding", guests: "Up to 75 guests" },
      { name: "Tropical Ever After", type: "Wedding", guests: "Up to 100 guests" },
      { name: "Grand Garden Affair", type: "Wedding", guests: "Up to 150 guests" },
      { name: "Grand Estate Experience", type: "Wedding", guests: "Up to 200 guests" },
      { name: "Signature Estate Wedding", type: "Grand Celebration", guests: "Up to 250 guests" },
    ],
    media: [
      { type: "image", src: "/partners/LPNFarm/Unknown-19.jpg" },
      { type: "image", src: "/partners/LPNFarm/Unknown-3.jpg" },
      { type: "image", src: "/partners/LPNFarm/Unknown-25.jpg" },
      { type: "image", src: "/partners/LPNFarm/Unknown-26.jpg" },
      { type: "video", src: "/partners/LPNFarm/Unknown.mp4" },
      { type: "video", src: "/partners/LPNFarm/Unknown-2.mp4" },
      { type: "video", src: "/partners/LPNFarm/Unknown-3.mp4" },
    ],
  },
];
