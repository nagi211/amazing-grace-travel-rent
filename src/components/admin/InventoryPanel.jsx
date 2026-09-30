import { useState } from "react";
import { pricingGroups } from "../../data/pricing";
import { upsertInventoryQty } from "../../lib/inventory";
import ItemAvailabilityCalendar from "./ItemAvailabilityCalendar";

function buildInventoryMap(inventory) {
  const map = {};
  for (const row of inventory) map[row.item_id] = row.total_qty;
  return map;
}

// Item metadata (name, category) lives in pricingGroups (src/data/pricing.js)
// — the `inventory` table only ever stores a quantity keyed by item id, so
// this panel is the join between the two.
export default function InventoryPanel({ inventory, inquiries, onInventoryUpdate }) {
  const qtyByItem = buildInventoryMap(inventory);
  const [activeItem, setActiveItem] = useState(null);
  const [drafts, setDrafts] = useState({});

  async function commitQty(itemId, rawValue) {
    const qty = Math.max(0, Math.floor(Number(rawValue)) || 0);
    setDrafts((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    if (qty === (qtyByItem[itemId] ?? 0)) return;

    onInventoryUpdate((current) => {
      const exists = current.some((row) => row.item_id === itemId);
      return exists
        ? current.map((row) => (row.item_id === itemId ? { ...row, total_qty: qty } : row))
        : [...current, { item_id: itemId, total_qty: qty }];
    });
    await upsertInventoryQty(itemId, qty);
  }

  if (activeItem) {
    return (
      <ItemAvailabilityCalendar
        item={activeItem}
        totalQty={qtyByItem[activeItem.id] ?? 0}
        inquiries={inquiries}
        onBack={() => setActiveItem(null)}
      />
    );
  }

  return (
    <div className="admin-inventory">
      <p className="admin-inventory-intro">
        Set how many of each item you own. The availability calendar sums pending, contacted, and
        confirmed inquiries against this number for each date.
      </p>
      {pricingGroups.map((group) => (
        <div className="admin-inventory-group" key={group.id}>
          <h2>{group.title}</h2>
          <ul className="admin-inventory-list">
            {group.items.map((item) => (
              <li className="admin-inventory-row" key={item.id}>
                <span className="admin-inventory-name">{item.name}</span>
                <div className="admin-inventory-controls">
                  <label className="admin-inventory-qty">
                    Owned
                    <input
                      type="number"
                      min="0"
                      value={drafts[item.id] ?? qtyByItem[item.id] ?? 0}
                      onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: e.target.value }))}
                      onBlur={(e) => commitQty(item.id, e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline admin-inventory-view"
                    onClick={() => setActiveItem({ id: item.id, name: item.name })}
                  >
                    View availability
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
