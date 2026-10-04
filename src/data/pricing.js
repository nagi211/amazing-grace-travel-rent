// Full rental & service price list, sourced from the printed pricing flyer.
// Grouped to mirror the flyer's layout so it's easy to keep in sync.
//
// `amount` is the numeric dollar value used for cart math (an estimate only —
// final pricing is confirmed when we follow up on a quote request). `unit`
// describes how it scales ("each", "per person", or null for a flat price).
export const pricingGroups = [
  {
    id: "chairs",
    icon: "Armchair",
    title: "Chairs",
    items: [
      { id: "white-resin-chairs", name: "White Resin Chairs", price: "$4 each", amount: 4, unit: "each", image: "/items/chairs/chair_white.jpg" },
      { id: "folding-chair-natural", name: "Folding Chair (Natural Wood)", price: "$7 each", amount: 7, unit: "each", image: "/items/chairs/chair_2.jpg" },
      { id: "folding-chair-dark-brown", name: "Folding Chair (Dark Brown)", price: "$7 each", amount: 7, unit: "each", image: "/items/chairs/chair_3.jpg" },
      { id: "wooden-chair-crossback", name: "Wooden Cross-Back Chair", price: "$12 each", amount: 12, unit: "each", image: "/items/chairs/wooden_chair.png" },
    ],
  },
  {
    id: "tables",
    icon: "Table2",
    title: "Tables",
    items: [
      { id: "folding-white-tables", name: "6 ft Folding White Tables", price: "$8 each", amount: 8, unit: "each", image: "/items/tables/table_long.jpg" },
      { id: "folding-white-tables-8ft", name: "8 ft Folding White Tables", price: "$10 each", amount: 10, unit: "each", image: "/items/tables/table_long.jpg" },
      { id: "round-tables", name: '72" Round Tables', price: "$35 each", amount: 35, unit: "each", image: "/items/tables/table_short.jpg" },
      {
        id: "full-table-setup",
        name: "Full Table Setup",
        price: "$37 per person",
        amount: 37,
        unit: "person",
        images: [
          "/items/tables/full_table_setup.jpg",
          "/items/tables/full_table_setup1.jpg",
          "/items/tables/full_table_setup2.jpg",
          "/items/tables/full_table_setup3.jpg",
        ],
        cover: true,
      },
      {
        id: "sweetheart-table-setup",
        name: "Sweetheart Table Setup",
        price: "$350",
        amount: 350,
        unit: null,
        images: ["/items/tables/sweetheart_table_cropped.jpg", "/items/tables/sweet_heart_table2.jpg"],
        cover: true,
      },
      {
        id: "buffet-dessert-table-setup",
        name: "Buffet & Dessert Table Setup",
        price: "$250",
        amount: 250,
        unit: null,
        images: [
          "/items/tables/dessert_setup.jpg",
          "/items/tables/dessert_setup1.jpg",
          "/items/tables/dessert_setup2.jpg",
        ],
        cover: true,
      },
    ],
  },
  {
    id: "tents",
    icon: "Tent",
    title: "Tents",
    items: [
      { id: "tent-pop-up-10x10", name: "10' x 10' - Pop Up", price: "$185", amount: 185, unit: null, image: "/items/tents/pop_up_tent.jpg" },
      { id: "tent-pop-up-10x20", name: "10' x 20' - Pop Up", price: "$285", amount: 285, unit: null, image: "/items/tents/pop_up_tent.jpg" },
      { id: "tent-high-peak-20x20", name: "20' x 20' - High Peak", price: "$750", amount: 750, unit: null, image: "/items/tents/high_peak.png", cover: true },
      { id: "tent-high-peak-20x40", name: "20' x 40' - High Peak", price: "$1,850", amount: 1850, unit: null, image: "/items/tents/high_peak.png", cover: true },
      {
        id: "tent-a-frame-20x20",
        name: "20' x 20' - A-Frame",
        price: "$350",
        amount: 350,
        unit: null,
        images: ["/items/tents/a_frame_tent1.jpg", "/items/tents/a_frame_tent2.jpg"],
        cover: true,
      },
      {
        id: "tent-a-frame-20x40",
        name: "20' x 40' - A-Frame",
        price: "$700",
        amount: 700,
        unit: null,
        images: ["/items/tents/a_frame_tent1.jpg", "/items/tents/a_frame_tent2.jpg"],
        cover: true,
      },
      { id: "sailcloth-tent-44x43", name: "Sailcloth Tent – 44' x 43'", price: "$3,100", amount: 3100, unit: null, image: "/items/tents/sailcloth_44x43.jpg", cover: true },
      { id: "sailcloth-tent-44x63", name: "Sailcloth Tent – 44' x 63'", price: "$4,050", amount: 4050, unit: null, image: "/items/tents/sailcloth_44x63.jpg", cover: true },
      { id: "sailcloth-tent-44x83", name: "Sailcloth Tent – 44' x 83'", price: "$4,850", amount: 4850, unit: null, image: "/items/tents/sailcloth_44x83.jpg", cover: true },
      { id: "sailcloth-tent-44x103", name: "Sailcloth Tent – 44' x 103'", price: "$5,850", amount: 5850, unit: null, image: "/items/tents/sailcloth_44x103.jpg", cover: true },
      { id: "sailcloth-tent-44x123", name: "Sailcloth Tent – 44' x 123'", price: "$6,850", amount: 6850, unit: null, image: "/items/tents/sailcloth_44x123.jpg", cover: true },
      { id: "welcome-bar-umbrella", name: "Welcome / Bar Umbrella", price: "$150", amount: 150, unit: null, image: "/items/decor-displays/umbrella.jpg", cover: true },
    ],
  },
  {
    id: "flooring",
    icon: "LayoutGrid",
    title: "Flooring",
    items: [
      { id: "dance-floor-natural", name: "Dance Floor – Natural", price: "$75", amount: 75, unit: null, image: "/items/floors/dance_floor_natural.jpg" },
      { id: "dance-floor-white", name: "Dance Floor – White", price: "$75", amount: 75, unit: null, image: "/items/floors/dance_floor_white.jpg" },
      { id: "dance-floor-dark-wood", name: "Dance Floor – Dark Wood", price: "$75", amount: 75, unit: null, image: "/items/floors/dance_floor_dark_wood.jpg" },
    ],
  },
  {
    id: "linens",
    icon: "Layers",
    title: "Linens",
    items: [
      {
        id: "tablecloths",
        name: "Tablecloths",
        price: "$15 each",
        amount: 15,
        unit: "each",
        images: [
          "/items/linens/tablecloth_banquet_hero.jpg",
          "/items/linens/tablecloth_fitted_detail.jpg",
          "/items/linens/tablecloth_white_plain.jpg",
          "/items/linens/tablecloth_black.jpg",
          "/items/linens/tablecloth_blue.jpg",
          "/items/linens/tablecloth_ivory.jpg",
        ],
        cover: true,
        variants: [
          {
            key: "size",
            label: "Size",
            options: ['48" Rectangular', '60" Rectangular', '72" Rectangular', '96" Rectangular', '60" Round'],
          },
          { key: "color", label: "Color", options: ["White", "Ivory", "Black", "Royal Blue"] },
          { key: "type", label: "Type", options: ["Spandex Fitted", "Ruffled Skirt"] },
        ],
      },
      { id: "napkin-polyester", name: "Napkin – Polyester", note: "Many colors available", price: "$1.25 each", amount: 1.25, unit: "each", image: "/items/linens/napkin_polyester.jpg" },
      { id: "napkin-silk", name: "Napkin – Silk", price: "$1.25 each", amount: 1.25, unit: "each", image: "/items/linens/napkin_silk.jpg" },
      {
        id: "table-runner",
        name: "Table Runner",
        price: "$5 each",
        amount: 5,
        unit: "each",
        images: [
          "/items/linens/table_runner_satin.jpg",
          "/items/linens/table_runner_cheesecloth.jpg",
          "/items/linens/table_runner_chiffon.jpg",
        ],
        cover: true,
        variants: [{ key: "type", label: "Type", options: ["Satin", "Cheesecloth", "Chiffon/Sheer"] }],
      },
    ],
  },
  {
    id: "chinaware",
    icon: "UtensilsCrossed",
    title: "Chinaware",
    items: [
      { id: "plate-dinner", name: "Round White Dinner Plate", price: "$1.15 each", amount: 1.15, unit: "each", image: "/items/chinaware/plate_dinner.png" },
      { id: "plate-salad", name: "Round White Salad Plate", price: "$1.15 each", amount: 1.15, unit: "each", image: "/items/chinaware/plate_salad.png" },
      {
        id: "charger-plate",
        name: "Charger Plate",
        price: "$5 each",
        amount: 5,
        unit: "each",
        images: [
          "/items/chinaware/charger_gold.jpg",
          "/items/chinaware/charger_rattan.jpg",
          "/items/chinaware/charger_gold_rim.jpg",
          "/items/chinaware/charger_white.jpg",
          "/items/chinaware/charger_transparent.jpg",
        ],
        variants: [
          { key: "color", label: "Color", options: ["Gold", "Rattan", "Clear with Gold Rim", "White", "Transparent"] },
        ],
      },
      { id: "flatware-gold", name: "Flatware Set – Gold", price: "$1.95 each", amount: 1.95, unit: "each", image: "/items/chinaware/flatware_gold.jpg" },
      { id: "flatware-silver", name: "Flatware Set – Silver", price: "$1.95 each", amount: 1.95, unit: "each", image: "/items/chinaware/flatware_silver.jpg" },
      { id: "wine-glass-glass", name: "Wine Glass – Glass", price: "$1.10 each", amount: 1.1, unit: "each", image: "/items/chinaware/wine_glass.jpg" },
      { id: "wine-glass-plastic", name: "Wine Glass – Plastic", note: "Price to be confirmed", price: "Price TBD", amount: 0, unit: "each" },
    ],
  },
  {
    id: "lighting",
    icon: "Lightbulb",
    title: "Lighting",
    items: [
      {
        id: "string-lights-100ft",
        name: "100 ft String Lights with Pole & Cement Base",
        note: "9-10 ft string light pole with cement base",
        price: "$100 each",
        amount: 100,
        unit: "each",
        image: "/items/lighting/string_lights.jpg",
      },
      { id: "pendant-light-dome", name: "Dome Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_1.jpg" },
      { id: "pendant-light-bottle", name: "Bottle Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_2.jpg" },
      { id: "pendant-light-globe", name: "Globe Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_3.jpg" },
      { id: "pendant-light-knot", name: "Knot Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_4.jpg" },
      { id: "pendant-light-swirl", name: "Swirl Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_5.jpg" },
      { id: "pendant-light-tiered", name: "Tiered Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_6.jpg" },
      { id: "pendant-light-cylinder", name: "Cylinder Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_7.jpg" },
      { id: "pendant-light-vase", name: "Vase Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_8.jpg" },
      { id: "pendant-light-bell", name: "Bell Pendant Light", price: "$100 each", amount: 100, unit: "each", image: "/items/lighting/pendant_light_9.jpg" },
    ],
  },
  {
    id: "decor-displays",
    icon: "Sparkles",
    title: "Decor & Displays",
    items: [
      {
        id: "wooden-bar",
        name: "Wooden Bar",
        note: "Can customize decals",
        price: "$250",
        amount: 250,
        unit: null,
        image: "/items/decor-displays/mobile_bar.jpg",
        cover: true,
      },
      { id: "display-shelf", name: "Shelf", price: "$150", amount: 150, unit: null, image: "/items/decor-displays/shelfie.jpg", cover: true },
      {
        id: "custom-panels",
        name: "Customized Panels",
        note: "For any occasion",
        price: "$250",
        amount: 250,
        unit: null,
        image: "/items/decor-displays/signage.jpg",
        cover: true,
      },
      {
        id: "welcome-mirror",
        name: "Customized Welcome Mirror",
        note: "Gold, black, or white rim",
        price: "$150",
        amount: 150,
        unit: null,
        image: "/selfie_mirror.jpg",
        cover: true,
      },
      { id: "center-stand", name: "Center Stand", price: "$1,500", amount: 1500, unit: null, image: "/items/decor-displays/center_stand.jpg", cover: true },
      { id: "lei-stand", name: "Lei Stand", price: "$350", amount: 350, unit: null, image: "/gallery/stand_set_up.jpg", cover: true },
      {
        id: "white-pedestals",
        name: "White Pedestals",
        price: "$50 each",
        amount: 50,
        unit: "each",
        image: "/items/decor-displays/white_pedestal.png",
        variants: [{ key: "size", label: "Size", options: ['34"', '24"', '22"'] }],
      },
      { id: "cooler-120qt", name: "Cooler (120 qt)", price: "$30", amount: 30, unit: null },
    ],
  },
  {
    id: "ceremony-services",
    icon: "Heart",
    title: "Ceremony Services",
    items: [{ id: "wedding-officiant", name: "Wedding Officiant", price: "$350", amount: 350, unit: null }],
  },
  {
    id: "entertainment",
    icon: "Music",
    title: "Entertainment",
    items: [
      {
        id: "dj-emcee-package",
        name: "DJ & Emcee Package",
        note: "DJ with Sound System + Emcee",
        price: "$1,350",
        amount: 1350,
        unit: null,
      },
    ],
  },
  {
    id: "coordination-planning",
    icon: "ClipboardList",
    title: "Coordination & Planning Services",
    items: [
      { id: "maid-of-honor", name: "Maid of Honor Service (Partial planning)", price: "$3,000", amount: 3000, unit: null },
      { id: "full-wedding-planning", name: "Full Premium Planning", price: "$5,000", amount: 5000, unit: null },
    ],
  },
];

export const staffingRate = "$25/hr";

export const fulfillmentNote =
  "Delivery, set up, breakdown, and staffing fees are available upon request and are customized based on your event needs.";

export const pricingDisclaimer = "Excluding tax, delivery, set up, breakdown fee.";

// Expanded detail for the two planning packages, for anyone who wants the
// full breakdown rather than just the flyer's one-line price. Shares ids
// with the matching items above so "Add to Cart" refers to the same item.
export const planningPackages = [
  {
    id: "maid-of-honor",
    name: "Maid of Honor Wedding Planning Package",
    price: "$3,000",
    amount: 3000,
    description:
      "Designed to provide hands-on guidance and support as you prepare for your big day.",
    includes: [
      "Begins 6 months before your wedding",
      "Timeline creation and vendor coordination",
      "Regular planning check-ins",
      "Full wedding day coordination and breakdown support",
      "Two Zoom meetings in the 3 months out",
      "Dedicated team of 1 Lead Coordinator (Bride) and 1 Assistant Coordinator (Groom)",
    ],
  },
  {
    id: "full-wedding-planning",
    name: "Full Wedding Planning Package",
    price: "$5,000",
    amount: 5000,
    description: "Full-service planning and coordination from the day you book through your last dance.",
    coverage: [
      "Begins from the day you secure your date",
      "Full planning support & event design guidance",
      "Vendor sourcing, booking & management",
      "Budget guidance & planning assistance",
      "Unlimited communication & meetings",
      "Timeline + floor plan creation",
      "Full event execution + breakdown management",
    ],
    team: [
      "Lead Coordinator",
      "2–3 Assistants",
      "Monthly planning support with 1 Zoom meeting per month",
      "In the final 3 months: increased support with 2 Zoom meetings per month",
    ],
  },
];
