// Full rental & service price list, sourced from the printed pricing flyer.
// Grouped to mirror the flyer's layout so it's easy to keep in sync.
//
// `amount` is the numeric dollar value used for cart math (an estimate only —
// final pricing is confirmed when we follow up on a quote request). `unit`
// describes how it scales ("each", "per person", or null for a flat price).
export const pricingGroups = [
  {
    id: "individual-rentals",
    icon: "Armchair",
    title: "Individual Rentals",
    items: [
      { id: "white-resin-chairs", name: "White Resin Chairs", price: "$3 each", amount: 3, unit: "each" },
      { id: "folding-white-tables", name: "6 ft Folding White Tables", price: "$8 each", amount: 8, unit: "each" },
      { id: "round-tables", name: '72" Round Tables', price: "$35 each", amount: 35, unit: "each" },
      { id: "tablecloths", name: "Tablecloths", price: "$15 each", amount: 15, unit: "each" },
      { id: "white-pedestals", name: "White Pedestals (Different Sizes)", price: "$50 each", amount: 50, unit: "each" },
      { id: "cooler-120qt", name: "Cooler (120 qt)", price: "$30", amount: 30, unit: null },
    ],
  },
  {
    id: "tents",
    icon: "Tent",
    title: "Tents",
    items: [
      { id: "tent-20x20", name: "20 x 20 Tent", price: "$350", amount: 350, unit: null },
      { id: "tent-high-peak-20x40", name: "High Peak White Tent (20 x 40)", price: "$1,000", amount: 1000, unit: null },
    ],
  },
  {
    id: "table-event-setups",
    icon: "Table2",
    title: "Table & Event Setups",
    items: [
      { id: "full-table-setup", name: "Full Table Setup", price: "$37 per person", amount: 37, unit: "person" },
      { id: "sweetheart-table-setup", name: "Sweetheart Table Setup", price: "$350", amount: 350, unit: null },
      { id: "buffet-dessert-table-setup", name: "Buffet & Dessert Table Setup", price: "$250", amount: 250, unit: null },
      { id: "lei-stand", name: "Lei Stand", price: "$350", amount: 350, unit: null },
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
