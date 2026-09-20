import { useEffect, useState } from "react";
import { LogOut, Mail, Phone, MapPin, Calendar, Users, Wallet } from "lucide-react";
import { supabaseAdmin } from "../../lib/supabaseAdminClient";
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

function formatMoney(amount) {
  if (amount == null) return "—";
  return `$${Number(amount).toLocaleString()}`;
}

export default function AdminDashboard() {
  const { signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [inquiries, setInquiries] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!supabaseAdmin) {
      setLoading(false);
      return;
    }

    let active = true;

    Promise.all([
      supabaseAdmin.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabaseAdmin
        .from("estimate_sessions")
        .select("*")
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false }),
    ]).then(([inquiriesRes, leadsRes]) => {
      if (!active) return;
      setInquiries(inquiriesRes.data || []);
      setLeads(leadsRes.data || []);
      setLoading(false);
    });

    const inquiriesChannel = supabaseAdmin
      .channel("inquiries-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, (payload) => {
        setInquiries((current) => {
          if (payload.eventType === "INSERT") return [payload.new, ...current];
          if (payload.eventType === "UPDATE")
            return current.map((row) => (row.id === payload.new.id ? payload.new : row));
          if (payload.eventType === "DELETE") return current.filter((row) => row.id !== payload.old.id);
          return current;
        });
      })
      .subscribe();

    const leadsChannel = supabaseAdmin
      .channel("estimate-sessions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "estimate_sessions" }, (payload) => {
        setLeads((current) => {
          if (payload.eventType === "INSERT") {
            return payload.new.status === "in_progress" ? [payload.new, ...current] : current;
          }
          if (payload.eventType === "UPDATE") {
            if (payload.new.status !== "in_progress") {
              return current.filter((row) => row.id !== payload.new.id);
            }
            return current.map((row) => (row.id === payload.new.id ? payload.new : row));
          }
          if (payload.eventType === "DELETE") return current.filter((row) => row.id !== payload.old.id);
          return current;
        });
      })
      .subscribe();

    return () => {
      active = false;
      supabaseAdmin.removeChannel(inquiriesChannel);
      supabaseAdmin.removeChannel(leadsChannel);
    };
  }, []);

  async function updateStatus(id, status) {
    setInquiries((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await supabaseAdmin.from("inquiries").update({ status }).eq("id", id);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Amazing Grace Admin</h1>
          <p>Amazing Grace Travels, Events &amp; Rentals</p>
        </div>
        <button type="button" className="admin-signout" onClick={signOut}>
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <main className="admin-main">
        <div className="admin-tabs">
          <button
            type="button"
            className={activeTab === "inquiries" ? "is-active" : ""}
            onClick={() => setActiveTab("inquiries")}
          >
            Inquiries {inquiries.length > 0 && `(${inquiries.length})`}
          </button>
          <button
            type="button"
            className={activeTab === "leads" ? "is-active" : ""}
            onClick={() => setActiveTab("leads")}
          >
            Warm Leads {leads.length > 0 && `(${leads.length})`}
          </button>
        </div>

        {loading ? (
          <p className="admin-empty">Loading...</p>
        ) : activeTab === "inquiries" ? (
          inquiries.length === 0 ? (
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
          )
        ) : leads.length === 0 ? (
          <p className="admin-empty">
            No warm leads yet — this fills up as people build an estimate in the chat without submitting
            the full quote form.
          </p>
        ) : (
          <ul className="admin-list">
            {leads.map((row) => (
              <li key={row.id} className="admin-card">
                <button
                  type="button"
                  className="admin-card-summary"
                  onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                >
                  <div className="admin-card-summary-main">
                    <strong>{row.email || "No email left"}</strong>
                    <span>{row.event_type || "—"}</span>
                    <span>Active {formatDate(row.updated_at)}</span>
                  </div>
                  <span className="admin-status-badge status-new">in progress</span>
                </button>

                {expandedId === row.id && (
                  <div className="admin-card-detail">
                    <div className="admin-detail-grid">
                      <span>
                        <Calendar size={14} /> {row.event_date || "No date given"}
                      </span>
                      <span>
                        <Users size={14} /> {row.guest_count ?? "—"} guests
                      </span>
                      <span>
                        <Wallet size={14} /> {formatMoney(row.budget)} budget
                      </span>
                    </div>
                    <p className="admin-detail-label">Cart so far</p>
                    {Array.isArray(row.cart_snapshot) && row.cart_snapshot.length > 0 ? (
                      <ul className="admin-cart-list">
                        {row.cart_snapshot.map((item) => (
                          <li key={item.id}>
                            {item.name} x{item.qty} — {formatMoney(item.amount * item.qty)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>—</p>
                    )}
                    {Array.isArray(row.suggested_plan) && row.suggested_plan.length > 0 && (
                      <>
                        <p className="admin-detail-label">Our suggestion</p>
                        <ul className="admin-cart-list">
                          {row.suggested_plan.map((item) => (
                            <li key={item.id}>
                              {item.name} x{item.qty} — {formatMoney(item.amount * item.qty)}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {row.email && (
                      <a className="btn btn-outline admin-lead-contact" href={`mailto:${row.email}`}>
                        <Mail size={14} /> Email {row.email}
                      </a>
                    )}
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
