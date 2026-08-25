// Full rental & service price list, sourced from the printed pricing flyer.
// Grouped to mirror the flyer's layout so it's easy to keep in sync.
export const pricingGroups = [
  {
    id: "individual-rentals",
    icon: "Armchair",
    title: "Individual Rentals",
    items: [
      { name: "White Resin Chairs", price: "$3 each" },
      { name: "6 ft Folding White Tables", price: "$8 each" },
      { name: '72" Round Tables', price: "$35 each" },
      { name: "Tablecloths", price: "$15 each" },
      { name: "White Pedestals (Different Sizes)", price: "$50 each" },
      { name: "Cooler (120 qt)", price: "$30" },
    ],
  },
  {
    id: "tents",
    icon: "Tent",
    title: "Tents",
    items: [
      { name: "20 x 20 Tent", price: "$350" },
      { name: "High Peak White Tent (20 x 40)", price: "$1,000" },
    ],
  },
  {
    id: "table-event-setups",
    icon: "Table2",
    title: "Table & Event Setups",
    items: [
      { name: "Full Table Setup", price: "$37 per person" },
      { name: "Sweetheart Table Setup", price: "$350" },
      { name: "Buffet & Dessert Table Setup", price: "$250" },
      { name: "Lei Stand", price: "$350" },
    ],
  },
  {
    id: "ceremony-services",
    icon: "Heart",
    title: "Ceremony Services",
    items: [{ name: "Wedding Officiant", price: "$350" }],
  },
  {
    id: "entertainment",
    icon: "Music",
    title: "Entertainment",
    items: [
      {
        name: "DJ & Emcee Package",
        note: "DJ with Sound System + Emcee",
        price: "$1,350",
      },
    ],
  },
  {
    id: "coordination-planning",
    icon: "ClipboardList",
    title: "Coordination & Planning Services",
    items: [
      { name: "Maid of Honor Service (Partial planning)", price: "$3,000" },
      { name: "Full Premium Planning", price: "$5,000" },
    ],
  },
];

export const staffingRate = "$25/hr";

export const fulfillmentNote =
  "Delivery, set up, breakdown, and staffing fees are available upon request and are customized based on your event needs.";

export const pricingDisclaimer = "Excluding tax, delivery, set up, breakdown fee.";

// Expanded detail for the two planning packages, for anyone who wants the
// full breakdown rather than just the flyer's one-line price.
export const planningPackages = [
  {
    id: "maid-of-honor",
    name: "Maid of Honor Wedding Planning Package",
    price: "$3,000",
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
