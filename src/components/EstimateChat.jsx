import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Armchair,
  Tent,
  Table2,
  Heart,
  Music,
  ClipboardList,
  Sparkles,
  Plus,
  Check,
  RotateCcw,
} from "lucide-react";
import { pricingGroups } from "../data/pricing";
import { EVENT_TYPES } from "../data/eventTypes";
import { buildSuggestedPlan } from "../lib/estimatePlanner";
import { useCart, formatMoney } from "../context/CartContext";
import "./EstimateChat.css";

const ICONS = { Armchair, Tent, Table2, Heart, Music, ClipboardList, Sparkles };

function formatEventDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const INITIAL_MESSAGES = [
  {
    from: "bot",
    text: "Aloha! I can put together a quick estimate for your event. What are you celebrating?",
  },
];

export default function EstimateChat() {
  const { addItem, itemCount, subtotal, requestQuoteFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("eventType"); // eventType | guestCount | eventDate | budget | categories | items
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [eventType, setEventType] = useState(null);
  const [guestCountInput, setGuestCountInput] = useState("");
  const [guestCount, setGuestCount] = useState(null);
  const [eventDateInput, setEventDateInput] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [justAdded, setJustAdded] = useState(null);
  const scrollRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current || !lastMessageRef.current) return;
    // Scroll so the newest reply starts at the top of the panel instead of
    // jumping to the bottom of whatever long item list follows it.
    scrollRef.current.scrollTop = lastMessageRef.current.offsetTop - 8;
  }, [messages]);

  function pushMessage(from, text) {
    setMessages((current) => [...current, { from, text }]);
  }

  function handleSelectEventType(type) {
    setEventType(type);
    pushMessage("user", type);
    pushMessage("bot", `Got it — a ${type}! About how many guests are you expecting?`);
    setStep("guestCount");
  }

  function handleSubmitGuestCount(e) {
    e.preventDefault();
    if (!guestCountInput) return;
    setGuestCount(Number(guestCountInput));
    pushMessage("user", `${guestCountInput} guests`);
    pushMessage("bot", "When's the big day? (You can skip this if you're not sure yet.)");
    setStep("eventDate");
  }

  function handleSubmitEventDate(e) {
    e.preventDefault();
    if (!eventDateInput) return;
    setEventDate(eventDateInput);
    pushMessage("user", formatEventDate(eventDateInput));
    pushMessage("bot", "Do you have a budget in mind? I can put together a starting plan that fits it.");
    setStep("budget");
  }

  function handleSkipEventDate() {
    pushMessage("user", "I'm not sure yet");
    pushMessage("bot", "No worries. Do you have a budget in mind? I can put together a starting plan that fits it.");
    setStep("budget");
  }

  function handleSubmitBudget(e) {
    e.preventDefault();
    if (!budgetInput) return;
    const budgetValue = Number(budgetInput);
    setBudget(budgetValue);
    pushMessage("user", `${formatMoney(budgetValue)} budget`);

    const plan = buildSuggestedPlan({ eventType, guestCount, budget: budgetValue });
    addItem(plan.essential.item, plan.essential.qty);
    plan.addOns.forEach(({ item, qty }) => addItem(item, qty));

    const lines = [
      `- ${plan.essential.item.name} x${plan.essential.qty} — ${formatMoney(
        plan.essential.item.amount * plan.essential.qty
      )}`,
      ...plan.addOns.map(({ item, qty }) => `- ${item.name} x${qty} — ${formatMoney(item.amount * qty)}`),
    ];

    if (plan.overBudget) {
      pushMessage(
        "bot",
        `Seating alone for ${guestCount} guests runs about ${formatMoney(plan.total)}, which is already above ${formatMoney(
          budgetValue
        )}. Here's that baseline — let's talk about trade-offs, or adjust guest count / budget with Start Over.\n\n${lines.join("\n")}`
      );
    } else {
      pushMessage(
        "bot",
        `Here's a starting plan for ${formatMoney(budgetValue)} and ${guestCount} guests:\n\n${lines.join(
          "\n"
        )}\n\nThat leaves about ${formatMoney(plan.remaining)}. Add or remove anything below, then request your quote.`
      );
    }

    setSelectedCategoryIds(pricingGroups.map((g) => g.id));
    setStep("items");
  }

  function handleSkipBudget() {
    pushMessage("user", "I'll just browse");
    pushMessage("bot", "No problem — what do you need for your event? Tap everything that applies.");
    setStep("categories");
  }

  function toggleCategory(id) {
    setSelectedCategoryIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }

  function handleContinueCategories(ids) {
    const names = pricingGroups.filter((g) => ids.includes(g.id)).map((g) => g.title);
    pushMessage("user", names.length ? names.join(", ") : "Show me everything");
    pushMessage("bot", "Here's what we've got — tap + to add items. I'll keep a running total below.");
    setSelectedCategoryIds(ids);
    setStep("items");
  }

  function handleAdd(item) {
    const qty = item.unit === "person" && guestCount ? guestCount : 1;
    addItem(item, qty);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded((current) => (current === item.id ? null : current)), 1000);
  }

  function handleReset() {
    setMessages(INITIAL_MESSAGES);
    setStep("eventType");
    setEventType(null);
    setGuestCountInput("");
    setGuestCount(null);
    setEventDateInput("");
    setEventDate(null);
    setBudgetInput("");
    setBudget(null);
    setSelectedCategoryIds([]);
  }

  const visibleGroups = pricingGroups.filter((g) => selectedCategoryIds.includes(g.id));
  const remainingBudget = budget != null ? budget - subtotal : null;

  return (
    <>
      <button
        type="button"
        className="estimate-chat-launcher"
        aria-label={isOpen ? "Close estimate chat" : "Open estimate chat"}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="estimate-chat-panel" role="dialog" aria-label="Get an estimate">
          <div className="estimate-chat-header">
            <span>Get an Estimate</span>
            <div className="estimate-chat-header-actions">
              <button type="button" className="estimate-chat-reset" aria-label="Start over" onClick={handleReset}>
                <RotateCcw size={15} /> Start Over
              </button>
              <button
                type="button"
                className="estimate-chat-header-close"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="estimate-chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                ref={i === messages.length - 1 ? lastMessageRef : undefined}
                className={`estimate-chat-bubble ${m.from}`}
              >
                {m.text.split("\n").map((line, j) => (
                  <span key={j} className="estimate-chat-line">
                    {line}
                  </span>
                ))}
              </div>
            ))}

            {step === "eventType" && (
              <div className="estimate-chat-choices">
                {EVENT_TYPES.map((type) => (
                  <button key={type} type="button" onClick={() => handleSelectEventType(type)}>
                    {type}
                  </button>
                ))}
              </div>
            )}

            {step === "guestCount" && (
              <form className="estimate-chat-guest-form" onSubmit={handleSubmitGuestCount}>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={guestCountInput}
                  onChange={(e) => setGuestCountInput(e.target.value)}
                  aria-label="Number of guests"
                />
                <button type="submit" className="btn btn-primary">
                  Next
                </button>
              </form>
            )}

            {step === "eventDate" && (
              <>
                <form className="estimate-chat-guest-form" onSubmit={handleSubmitEventDate}>
                  <input
                    type="date"
                    value={eventDateInput}
                    onChange={(e) => setEventDateInput(e.target.value)}
                    aria-label="Event date"
                  />
                  <button type="submit" className="btn btn-primary">
                    Next
                  </button>
                </form>
                <button type="button" className="estimate-chat-skip" onClick={handleSkipEventDate}>
                  I'm not sure yet
                </button>
              </>
            )}

            {step === "budget" && (
              <>
                <form className="estimate-chat-guest-form" onSubmit={handleSubmitBudget}>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 15000"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    aria-label="Budget in dollars"
                  />
                  <button type="submit" className="btn btn-primary">
                    Build My Plan
                  </button>
                </form>
                <button type="button" className="estimate-chat-skip" onClick={handleSkipBudget}>
                  Skip — I'll just browse
                </button>
              </>
            )}

            {step === "categories" && (
              <>
                <div className="estimate-chat-choices">
                  {pricingGroups.map((group) => {
                    const Icon = ICONS[group.icon] || Armchair;
                    const active = selectedCategoryIds.includes(group.id);
                    return (
                      <button
                        key={group.id}
                        type="button"
                        className={active ? "is-active" : ""}
                        onClick={() => toggleCategory(group.id)}
                      >
                        <Icon size={14} /> {group.title}
                      </button>
                    );
                  })}
                </div>
                <div className="estimate-chat-continue-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={selectedCategoryIds.length === 0}
                    onClick={() => handleContinueCategories(selectedCategoryIds)}
                  >
                    Continue
                  </button>
                  {selectedCategoryIds.length === 0 && (
                    <p className="estimate-chat-hint">Tap one or more above, or skip below.</p>
                  )}
                  <button
                    type="button"
                    className="estimate-chat-skip"
                    onClick={() => handleContinueCategories(pricingGroups.map((g) => g.id))}
                  >
                    Not sure — show me everything
                  </button>
                </div>
              </>
            )}

            {step === "items" &&
              visibleGroups.map((group) => (
                <div className="estimate-chat-group" key={group.id}>
                  <p className="estimate-chat-group-title">{group.title}</p>
                  <ul className="estimate-chat-items">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <span className="estimate-chat-item-info">
                          {item.name}
                          {item.unit === "person" && guestCount && (
                            <span className="estimate-chat-item-hint">for {guestCount} guests</span>
                          )}
                        </span>
                        <span className="estimate-chat-item-price">{item.price}</span>
                        <button
                          type="button"
                          className="estimate-chat-item-add"
                          aria-label={`Add ${item.name}`}
                          onClick={() => handleAdd(item)}
                        >
                          {justAdded === item.id ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {step === "items" && (
            <div className="estimate-chat-footer">
              <div className="estimate-chat-total">
                <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              {remainingBudget != null && (
                <p className={`estimate-chat-budget-line ${remainingBudget < 0 ? "over" : ""}`}>
                  {remainingBudget < 0
                    ? `${formatMoney(Math.abs(remainingBudget))} over your ${formatMoney(budget)} budget`
                    : `${formatMoney(remainingBudget)} left of your ${formatMoney(budget)} budget`}
                </p>
              )}
              <div className="estimate-chat-footer-actions">
                <a href="#pricing" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                  Full Price List
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={itemCount === 0}
                  onClick={() => {
                    requestQuoteFromCart(eventDate ? { eventDate } : {});
                    setIsOpen(false);
                  }}
                >
                  Request a Quote
                </button>
              </div>
              {itemCount === 0 && (
                <p className="estimate-chat-hint">Tap + on at least one item above to request a quote.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
