import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { todayISODate } from "../../lib/dateUtils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const COUNTED_STATUSES = new Set(["pending", "contacted", "confirmed"]);

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dayState(reserved, total) {
  if (total <= 0) return reserved > 0 ? "full" : "unset";
  if (reserved >= total) return "full";
  if (reserved >= total * 0.8) return "tight";
  if (reserved > 0) return "booked";
  return "available";
}

// Per-item view of BookingCalendar's month grid: instead of "which
// inquiries fall on this day," this sums how much of ONE item those
// inquiries want, against how many the business actually owns.
export default function ItemAvailabilityCalendar({ item, totalQty, inquiries, onBack }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const byDate = {};
  for (const row of inquiries) {
    if (!row.event_date || !COUNTED_STATUSES.has(row.status)) continue;
    if (!Array.isArray(row.cart_items)) continue;
    const line = row.cart_items.find((ci) => ci.id === item.id);
    if (!line) continue;
    const entry = (byDate[row.event_date] ||= { qty: 0, rows: [] });
    entry.qty += Number(line.qty) || 0;
    entry.rows.push({ id: row.id, name: row.full_name, qty: line.qty, status: row.status });
  }

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISODate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function shiftMonth(delta) {
    setCursor((c) => {
      let m = c.month + delta;
      let y = c.year;
      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      return { year: y, month: m };
    });
  }

  return (
    <div className="admin-calendar admin-item-calendar">
      <button type="button" className="admin-item-calendar-back" onClick={onBack}>
        <ArrowLeft size={15} /> Back to Inventory
      </button>

      <div className="admin-item-calendar-title">
        <h2>{item.name}</h2>
        <span>{totalQty} owned</span>
      </div>

      <div className="admin-calendar-header">
        <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <h2>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="admin-calendar-legend">
        <span><i className="admin-calendar-dot day-available" /> Available</span>
        <span><i className="admin-calendar-dot day-booked" /> Booked</span>
        <span><i className="admin-calendar-dot day-tight" /> Almost full</span>
        <span><i className="admin-calendar-dot day-full" /> Fully booked</span>
      </div>

      <div className="admin-calendar-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="admin-calendar-grid">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} className="admin-calendar-cell is-empty" />;
          const iso = toISODate(year, month, d);
          const dayInfo = byDate[iso];
          const reserved = dayInfo?.qty || 0;
          const state = dayState(reserved, totalQty);
          return (
            <div
              key={iso}
              className={`admin-calendar-cell admin-item-day day-${state} ${iso === today ? "is-today" : ""}`}
            >
              <span className="admin-calendar-daynum">{d}</span>
              {dayInfo && (
                <div className="admin-item-day-qty" title={dayInfo.rows.map((r) => `${r.name} x${r.qty}`).join(", ")}>
                  {reserved} / {totalQty || "0"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
