import { pricingGroups } from "../data/pricing";

const ITEMS_BY_ID = Object.fromEntries(
  pricingGroups.flatMap((group) => group.items.map((item) => [item.id, item]))
);

// Greedy budget planner: pick a per-guest seating essential, then fill the
// remaining budget with add-ons in priority order. This is a starting
// suggestion, not a real event plan — it's meant to give guests who only
// know "$X for Y guests" something concrete to react to, before a human
// fine-tunes it on the actual quote.
//
// Priority list is hand-picked, not derived from sales data. Reorder freely
// as real booking patterns become clear.
const WEDDING_ADD_ON_IDS = [
  "wedding-officiant",
  "sweetheart-table-setup",
  "dj-emcee-package",
  "buffet-dessert-table-setup",
  "lei-stand",
  "wooden-bar",
  "custom-panels",
  "welcome-bar-umbrella",
  "welcome-mirror",
  "cooler-120qt",
  "maid-of-honor",
  "full-wedding-planning",
];

const GENERAL_ADD_ON_IDS = [
  "dj-emcee-package",
  "buffet-dessert-table-setup",
  "lei-stand",
  "wooden-bar",
  "custom-panels",
  "welcome-bar-umbrella",
  "welcome-mirror",
  "cooler-120qt",
];

function pickTent(guestCount) {
  return guestCount > 60 ? ITEMS_BY_ID["tent-high-peak-20x40"] : ITEMS_BY_ID["tent-high-peak-20x20"];
}

export function buildSuggestedPlan({ eventType, guestCount, budget }) {
  const essential = ITEMS_BY_ID["full-table-setup"];
  const essentialCost = essential.amount * guestCount;

  if (essentialCost > budget) {
    return {
      essential: { item: essential, qty: guestCount },
      addOns: [],
      total: essentialCost,
      remaining: budget - essentialCost,
      overBudget: true,
    };
  }

  let remaining = budget - essentialCost;
  const addOns = [];

  const tent = pickTent(guestCount);
  if (tent.amount <= remaining) {
    addOns.push({ item: tent, qty: 1 });
    remaining -= tent.amount;
  }

  const priorityIds = eventType === "Wedding" ? WEDDING_ADD_ON_IDS : GENERAL_ADD_ON_IDS;
  for (const id of priorityIds) {
    const item = ITEMS_BY_ID[id];
    if (!item || item.amount > remaining) continue;
    addOns.push({ item, qty: 1 });
    remaining -= item.amount;
  }

  const total = budget - remaining;
  return { essential: { item: essential, qty: guestCount }, addOns, total, remaining, overBudget: false };
}
