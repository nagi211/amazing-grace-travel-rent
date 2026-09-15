import { useEffect, useState } from "react";
import { LogOut, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./Admin.css";

const STATUSES = ["new", "contacted", "closed"];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const { signOut } = useAdminAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) {
          setInquiries(data || []);
          setLoading(false);
        }
      });

    const channel = supabase
      .channel("inquiries-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, (payload) => {
        setInquiries((current) => {
          if (payload.eventType === "INSERT") {
            return [payload.new, ...current];
          }
          if (payload.eventType === "UPDATE") {
            return current.map((row) => (row.id === payload.new.id ? payload.new : row));
          }
          if (payload.eventType === "DELETE") {
            return current.filter((row) => row.id !== payload.old.id);
          }
          return current;
        });
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id, status) {
    setInquiries((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await supabase.from("inquiries").update({ status }).eq("id", id);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Inquiries</h1>
          <p>Amazing Grace Travel &amp; Rentals</p>
        </div>
        <button type="button" className="admin-signout" onClick={signOut}>
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <main className="admin-main">
        {loading ? (
          <p className="admin-empty">Loading...</p>
        ) : inquiries.length === 0 ? (
          <p className="admin-empty">No inquiries yet.</p>
        ) : (
          <ul className="admin-list">
            {inquiries.map((row) => (
              <li key={row.id} className="admin-card">
                <button
                  type="button"
                  className="admin-card-summary"
                  onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                >
                  <div className="admin-card-summary-main">
                    <strong>{row.full_name}</strong>
                    <span>{row.event_type || "—"}</span>
                    <span>{formatDate(row.created_at)}</span>
                  </div>
                  <span className={`admin-status-badge status-${row.status}`}>{row.status}</span>
                </button>

                {expandedId === row.id && (
                  <div className="admin-card-detail">
                    <div className="admin-detail-grid">
                      <span>
                        <Mail size={14} /> {row.email}
                      </span>
                      <span>
                        <Phone size={14} /> {row.phone}
                      </span>
                      <span>
                        <Calendar size={14} /> {row.event_date || "No date given"}
                      </span>
                      <span>
                        <Users size={14} /> {row.guest_count ?? "—"} guests
                      </span>
                      {row.event_location && (
                        <span>
                          <MapPin size={14} /> {row.event_location}
                        </span>
                      )}
                    </div>
                    <p className="admin-detail-label">Interested in</p>
                    <p>{row.rental_needed || "—"}</p>
                    {row.details && (
                      <>
                        <p className="admin-detail-label">Details</p>
                        <p className="admin-detail-notes">{row.details}</p>
                      </>
                    )}
                    <div className="admin-status-row">
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`admin-status-btn ${row.status === status ? "is-active" : ""}`}
                          onClick={() => updateStatus(row.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
