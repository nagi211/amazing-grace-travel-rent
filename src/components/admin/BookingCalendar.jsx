import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { todayISODate } from "../../lib/dateUtils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Booking calendar built directly from `inquiries.event_date` -- no separate
// availability/inventory system exists, so this is purely a visual read of
// what's already been requested/confirmed, grouped onto the day it falls on.
export default function BookingCalendar({ inquiries }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const eventsByDate = {};
  for (const row of inquiries) {
    if (!row.event_date) continue;
    (eventsByDate[row.event_date] ||= []).push(row);
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
    <div className="admin-calendar">
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
        <span><i className="admin-calendar-dot status-pending" /> Pending</span>
        <span><i className="admin-calendar-dot status-contacted" /> Contacted</span>
        <span><i className="admin-calendar-dot status-confirmed" /> Confirmed</span>
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
          const dayEvents = eventsByDate[iso] || [];
          return (
            <div key={iso} className={`admin-calendar-cell ${iso === today ? "is-today" : ""}`}>
              <span className="admin-calendar-daynum">{d}</span>
              <div className="admin-calendar-events">
                {dayEvents.map((ev) => (
                  <span key={ev.id} className={`admin-calendar-event status-${ev.status}`} title={ev.rental_needed || ""}>
                    {ev.full_name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
